import fsspec, pyarrow.parquet as pq, json, sys
from concurrent.futures import ThreadPoolExecutor
B={"paris":(2.245,2.425,48.908,48.81),"madrid":(-3.745,-3.665,40.458,40.385),"barcelone":(2.115,2.215,41.424,41.36),
"londres":(-0.235,-0.02,51.552,51.458),"lisbonne":(-9.225,-9.085,38.768,38.685),"rome":(12.44,12.535,41.925,41.852),
"amsterdam":(4.845,4.945,52.405,52.345),"new-york":(-74.05,-73.93,40.82,40.685),"berlin":(13.29,13.475,52.555,52.47)}
fs=fsspec.filesystem("https",client_kwargs={"trust_env":True})
base="https://overturemaps-us-west-2.s3.us-west-2.amazonaws.com/"
keys=[l.strip() for l in open(sys.argv[1]) if l.strip()]
def scan(k):
    md=pq.ParquetFile(fs.open(base+k,block_size=2**20)).metadata
    names=[md.schema.column(i).path for i in range(md.num_columns)]
    ix={n:i for i,n in enumerate(names)}
    out=[]
    for g in range(md.num_row_groups):
        rg=md.row_group(g)
        def st(n): return rg.column(ix[n]).statistics
        x0=st("bbox.xmin").min; x1=st("bbox.xmax").max; y0=st("bbox.ymin").min; y1=st("bbox.ymax").max
        hit=[c for c,(w,e,n,s) in B.items() if x0<=e and x1>=w and y0<=n and y1>=s]
        if hit: out.append((g,hit,rg.num_rows))
    return k,out
res={}
with ThreadPoolExecutor(8) as ex:
    for k,out in ex.map(scan,keys):
        res[k]=out; print(k[-30:],len(out),sum(o[2] for o in out),flush=True)
json.dump(res,open(sys.argv[2],"w"))
