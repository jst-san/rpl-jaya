export class Api {
    public origin: string;
  
    constructor() {
      this.origin = 'http://localhost:8000';
    }
  
    public post(path:string = '/', init?: RequestInit | undefined) {
      return () => fetch(this.origin+path, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        ...init,
      });
    }
  
    public get(
      path:string = '/',
      params?:Record<string,string>[],
      init?: RequestInit | undefined,
    ) {
      let url = this.origin+path;
      params?.forEach(({ key, val }) => (url += key + "=" + val));
      return fetch(url, init);
    }
  
    public put(path:string = '/', init?: RequestInit | undefined) {
      return fetch(this.origin+path, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        ...init,
      });
    }
  
    public delete(path:string = '/', init?: RequestInit | undefined) {
      return fetch(this.origin+path, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        ...init,
      });
    }
  }
  