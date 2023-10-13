import { Injectable } from '@angular/core';
import { log, showAlertError } from '../model/message';
import { Usuario } from '../model/usuario';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

    constructor(private storage: Storage) { 
        this.storage.create();
    }

    async get(key: string) {
        this.storage.get(key);
    }

    private async leerUsuarioAutenticado(hideSecrets: boolean): Promise<Usuario | null> {
        log('StorageService.leerUsuarioAlmacenado', 'Revisando USER_DATA');
        return this.storage.get("USER_DATA").then((datos) => {
            if (datos !== null) {
                log('StorageService.leerUsuarioAlmacenado', `USER_DATA tiene datos: ${datos}`);
                const json = JSON.parse(datos);
                const usu = new Usuario();
                if (json.correo.trim() !== '') {
                    log('StorageService.leerUsuarioAlmacenado', `Los datos de USER_DATA son: ${json}`);
                    usu.setUsuario(
                        json.correo, 
                        json.password, 
                        json.nombre, 
                        json.apellido, 
                        json.preguntaSecreta, 
                        json.respuestaSecreta, 
                        json.sesionActiva,
                        hideSecrets
                    );
                    return Promise.resolve(usu);
                } else {
                    log('StorageService.leerUsuarioAlmacenado', `USER_DATA tenía datos vacíos`);
                }
            }
            log('StorageService.leerUsuarioAlmacenado', `USER_DATA no tiene datos`);
            return Promise.resolve(null);
        }).catch(err => {
            showAlertError('StorageService.leerUsuarioAlmacenado', err);
            return Promise.resolve(null);
        })
    }

    async leerUsuarioAutenticadoConPrivacidad(): Promise<Usuario | null> {
        return this.leerUsuarioAutenticado(true);
    }

    async leerUsuarioAutenticadoSinPrivacidad(): Promise<Usuario | null> {
        return this.leerUsuarioAutenticado(false);
    }

    async guardarUsuarioAutenticadoConPrivacidad(user: Usuario): Promise<void> {
        return await this.storage.set('USER_DATA', JSON.stringify(user));
    }

    async eliminarUsuarioAutenticado(): Promise<void> {
        return await this.storage.remove('USER_DATA');
    }

    async verificarExisteUsuarioAutenticado(): Promise<boolean> {
        return this.leerUsuarioAutenticado(false).then(usuario => { return usuario != null; });
    }

}








// import { Injectable } from '@angular/core';
// import { Capacitor } from '@capacitor/core';
// import { sqli
//     CapacitorDataStorageSqlite, CapacitorDataStorageSqlitePlugin, capDataStorageResult, capKeysResult,
//     capKeysValuesResult, capOpenStorageOptions, capTablesResult, capValueResult, capValuesResult
// } from '@ionic/storage-angular';
// import { log, showAlertError } from '../model/Message';
// import { Usuario } from '../model/Usuario';
// import { SQLiteService } from './sqlite.service';

// @Injectable({
//   providedIn: 'root'
// })
// export class StorageService {

//     platform: string;
//     isNative: boolean = false;
//     store: CapacitorDataStorageSqlitePlugin;
//     database: string;
//     encrypted: boolean = false;
//     mode: string;
//     table: string;
//     dbOptions: capOpenStorageOptions;
//     isRunning: boolean;
    
//     constructor(private db: SQLiteService) { }

//     StartStorageService(callee: string): Promise<boolean> {

//         this.database = 'asistencia';
//         this.encrypted = false;
//         this.mode = 'no-encryption';
//         this.table = 'STORAGE_TABLE';
//         this.dbOptions = {database: this.database, table: this.table, encrypted: this.encrypted, mode: this.mode};

//         return new Promise(async resolve => {
//             try {
//                 log('StorageService', `Iniciar servicio desde ${callee}`);
//                 log('StorageService', `db:${this.database} enc:${this.encrypted} mode:${this.mode} table:${this.table})`);
//                 this.platform = Capacitor.getPlatform();
//                 if(this.platform === 'ios' || this.platform === 'android') this.isNative = true;
//                 this.store = CapacitorDataStorageSqlite;
//                 await this.store.openStore(this.dbOptions);
//                 this.isRunning = true;
//                 log('StorageService', 'Servicio iniciado');
//                 resolve(true);
//             } catch(err) {
//                 log('StorageService', 'Servicio no pudo ser iniciado');
//                 await showAlertError('StorageService.StartStorageService', err);
//                 this.isRunning = false;
//                 resolve(false);
//             }
//         });
//     }

//     private async getStorageUser(hideSecrets: boolean): Promise<Usuario> {
//         log('getStorageUser', 'Revisando USER_DATA');
//         return this.getItem("USER_DATA").then((datos) => {
//             if (datos !== null) {
//                 if (datos.value !== '') {
//                     log('getStorageUser', `USER_DATA tiene datos: ${datos.value}`);
//                     const json = JSON.parse(datos.value);
//                     const usu = new Usuario();
//                     usu.setUser(
//                         json.correo, 
//                         json.password, 
//                         json.nombre, 
//                         json.preguntaSecreta, 
//                         json.respuestaSecreta, 
//                         json.sesionActiva, 
//                         hideSecrets
//                     );
//                     return usu;
//                 }
//             }
//             log('getStorageUser', `USER_DATA no tiene datos`);
//             return null;
//         }).catch(err => {
//             showAlertError('StorageService.getStorageUser', err);
//             return null;
//         })
//     }

//     async getSecureAuthUser(): Promise<Usuario> {
//         return this.getStorageUser(true);
//     }

//     async getUnsecureAuthUser(): Promise<Usuario> {
//         return this.getStorageUser(false);
//     }

//     async authUserExists(): Promise<boolean> {
//         return this.getStorageUser(false).then(usuario => { return !!usuario; });
//     }

//     async closeStore(): Promise<void> {
//         return await this.store.closeStore({ database: this.database });
//     }

//     async isStoreOpen(): Promise<capDataStorageResult> {
//         return await this.store.isStoreOpen({ database: this.database });
//     }

//     async isStoreExists(): Promise<capDataStorageResult> {
//         return await this.store.isStoreExists({ database: this.database });
//     }
  
//     async setTable(): Promise<void> {
//         await this.store.setTable({ table: this.table });
//     }

//     async setItem(key: string, value: string): Promise<void> {
//         return await this.store.set({ key, value });
//     }

//     async getItem(key:string): Promise<capValueResult> {
//         return await this.store.get({ key });
//     }

//     async isKey(key: string): Promise<capDataStorageResult> {
//         return await this.store.iskey({ key });
//     }

//     async getAllKeys(): Promise<capKeysResult> {
//         return await this.store.keys();
//     }

//     async getAllValues(): Promise<capValuesResult> {
//         return await this.store.values();
//     }

//     async getFilterValues(filter: string): Promise<capValuesResult> {
//         return await this.store.filtervalues({ filter });
//     }

//     async getAllKeysValues(): Promise<capKeysValuesResult> {
//         return await this.store.keysvalues();
//     }

//     async removeItem(key: string): Promise<void> {
//         return await this.store.remove({ key });
//     }

//     async clear(): Promise<void> {
//         return await this.store.clear();
//     }

//     async deleteStore(): Promise<void> {
//         return await this.store.deleteStore(this.dbOptions);
//     }

//     async isTable(): Promise<capDataStorageResult> {
//         return await this.store.isTable({ table: this.table });
//     }

//     async getAllTables(): Promise<capTablesResult> {
//         return await this.store.tables();
//     }

//     async deleteTable(): Promise<void> {
//         return await this.store.deleteTable({ table: this.table });
//     }
// }
