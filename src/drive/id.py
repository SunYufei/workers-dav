import json
from datetime import datetime, timedelta
from pathlib import Path
from typing import Optional

import requests

proxy = 'https://p.ipear.ml'
files_uri = f'{proxy}/www.googleapis.com/drive/v3/files'
oauth_uri = f'{proxy}/www.googleapis.com/oauth2/v4/token'


class Cache:
    def __init__(self):
        self._filepath = Path('cache.json')
        self._cache = {}
        self._load_from_json()
        self._new_item_count = 0
        self._save_thresh = 10

    def set(self, path: Path, path_id: str):
        path = Path(path) if not isinstance(path, Path) else path
        parent, name = str(path.parent).replace('\\', '/'), path.name
        if parent not in self._cache:
            self._cache[parent] = {}
        self._cache[parent][name] = path_id
        self._new_item_count += 1
        if self._new_item_count >= self._save_thresh:
            self._save_to_json()
            self._new_item_count = 0

    def get(self, path: Path):
        path = Path(path) if not isinstance(path, Path) else path
        parent, name = str(path.parent).replace('\\', '/'), path.name
        if self._cache.get(parent) is None or self._cache[parent].get(name) is None:
            self._load_from_json()
        return None if self._cache.get(parent) is None else self._cache[parent].get(name)

    def _save_to_json(self):
        with self._filepath.open('w', encoding='utf-8') as f:
            json.dump(self._cache, f)

    def _load_from_json(self):
        with self._filepath.open(encoding='utf-8') as f:
            self._cache = json.load(f)

    def __del__(self):
        self._save_to_json()


class GoogleDrive:
    def __init__(self):
        # load config
        with open('config.json') as f:
            self._auth_config = json.load(f)

        # access token
        self._access_token = None
        self._expires = datetime.now() + timedelta(minutes=-1)

        # id cache
        self._cache = Cache()

    def _get_access_token(self):
        try:
            if self._access_token is None or self._expires < datetime.now():
                r = requests.post(oauth_uri,
                                  data=self._auth_config,
                                  headers={'content-type': 'application/x-www-form-urlencoded'})
                data = r.json()
                self._access_token = data.get('access_token')
                self._expires = datetime.now() + timedelta(seconds=data.get('expires_in') - 1)
                print(f'INFO _get_access_token:', 'success' if self._access_token is not None else 'failed')
        finally:
            return self._access_token

    def _base_headers(self) -> dict:
        return {
            'Authorization': f'Bearer {self._get_access_token()}',
            'Content-Type': 'application/json'
        }

    def item_id(self, path: Path, create=False) -> Optional[str]:
        # pre-process path
        path = Path(path) if not isinstance(path, Path) else path
        if [p for p in path.parents][-1] == Path('.'):
            path = Path('/') / path
        print(f'INFO item_id: get {path}')

        cur_path = Path('/')
        cur_id = self._cache.get(cur_path)
        for item in path.parts[1:]:
            cur_path = cur_path / item
            # cur_path's id not in cache
            if self._cache.get(cur_path / item) is None:
                params = {
                    'includeItemsFromAllDrives': True,
                    'supportsAllDrives': True,
                    'q': "'{0}' in parents and name='{1}' and trashed=false".format(cur_id, item.replace("'", "\\'")),
                    'fields': 'files(id, name, mimeType)'
                }
                r = requests.get(files_uri, params=params, headers=self._base_headers())
                # TODO fix it
                try:
                    if 'files' not in r.json():
                        print(f'ERROR item_id: request failed')
                        print(f'ERROR item_id: response text {r.text}')
                        print(f'ERROR item_id: path {path}')
                        print(f'ERROR item_id: params {params}')
                        return None
                except Exception as e:
                    print(f'ERROR item_id: {e}')
                    return None
                files = r.json()['files']
                if len(files) > 0:
                    print(f'INFO item_id: get {cur_path} successful')
                    self._cache.set(cur_path, files[0]['id'])
                else:
                    if not create:
                        # parent not exist, create is False
                        print(f'INFO item_id: {cur_path} not exist and not create')
                        return None
                    else:
                        # parent not exist, create is True
                        params = {'supportsAllDrives': True}
                        metadata = {
                            'name': item,
                            'mimeType': 'application/vnd.google-apps.folder',
                            'parents': [cur_id]
                        }
                        r = requests.post(files_uri, params=params, json=metadata, headers=self._base_headers())
                        data = r.json()
                        if 'name' in data and data['name'] == item:
                            print(f'INFO item_id: create {cur_path} successful')
                            self._cache.set(path, data['id'])
                        else:
                            print(f'ERROR item_id: create {cur_path} failed')
                            return None
            cur_id = self._cache.get(cur_path)

        return self._cache.get(path)
