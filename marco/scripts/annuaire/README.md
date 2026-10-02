# Répertoire complet des villes (public/annuaire-data)

Source : Overture Maps, thème `places` (licence CDLA-Permissive-2.0, dont données OpenStreetMap sous ODbL).

1. `python3 scan.py keys.txt rgs.json` : `keys.txt` liste les fichiers parquet de la version Overture (listing S3 `release/<version>/theme=places/type=place/`). Le script lit seulement les pieds de fichiers et garde les groupes de lignes qui touchent les 9 villes.
2. `python3 extract.py` : lit ces groupes (colonnes utiles seulement) et garde les lieux dans le cadre de chaque ville (`places.pkl`).
3. `python3 build.py` : trie par familles (restos, bars, cafés, sorties, culture et activités, sport, cours, bien-être, hôtels), enlève les lieux fermés et les fiches douteuses, puis écrit `dir/<ville>.json`. Copier ensuite le résultat dans `public/annuaire-data/`.

Dépendances : `pip install pyarrow fsspec aiohttp`.
