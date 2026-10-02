import fsspec, pyarrow.parquet as pq, pyarrow as pa, json, pickle
from concurrent.futures import ThreadPoolExecutor
B={"paris":(2.245,2.425,48.908,48.81),"madrid":(-3.745,-3.665,40.458,40.385),"barcelone":(2.115,2.215,41.424,41.36),
"londres":(-0.235,-0.02,51.552,51.458),"lisbonne":(-9.225,-9.085,38.768,38.685),"rome":(12.44,12.535,41.925,41.852),
"amsterdam":(4.845,4.945,52.405,52.345),"new-york":(-74.05,-73.93,40.82,40.685),"berlin":(13.29,13.475,52.555,52.47)}
fs=fsspec.filesystem("https",client_kwargs={"trust_env":True})
base="https://overturemaps-us-west-2.s3.us-west-2.amazonaws.com/"
rgs=json.load(open("rgs.json"))
cols=["id","names","basic_category","taxonomy","bbox","addresses","websites","phones","socials","confidence","operating_status","brand"]
jobs=[(k,g) for k,v in rgs.items() for g,_,_ in v]
def run(j):
    k,g=j
    pf=pq.ParquetFile(fs.open(base+k,block_size=2**22))
    avail=[c for c in cols if c in pf.schema_arrow.names]
    t=pf.read_row_group(g,columns=avail).to_pylist()
    out=[]
    for r in t:
        b=r["bbox"]; x=(b["xmin"]+b["xmax"])/2; y=(b["ymin"]+b["ymax"])/2
        for c,(w,e,n,s) in B.items():
            if w<=x<=e and s<=y<=n:
                r["city"]=c; r["x"]=x; r["y"]=y; out.append(r); break
    print(k[-20:],g,len(out),flush=True)
    return out
allr=[]
with ThreadPoolExecutor(8) as ex:
    for o in ex.map(run,jobs): allr+=o
pickle.dump(allr,open("places.pkl","wb"))
print("total",len(allr))
