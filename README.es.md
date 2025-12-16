<div align="center">

> ⚠️ **Nota de traducción:** Este documento ha sido traducido por IA. Si encuentra algún error, por favor indíquelo. ¡Gracias!

Este proyecto es un fork de <b>star-history/star-history</b> y ha sido mejorado. No fusionará código de vuelta al proyecto original.

# :sparkles: gitdata analysis :sparkles:

[**gitdata.xuanhun520.com**](https://gitdata.xuanhun520.com), **proporciona capacidades de estadísticas y visualización de datos faltantes para repositorios de GitHub, como la funcionalidad de gráficos de historial de estrellas.**

<picture>
  <source media="(prefers-color-scheme: dark) and (max-width: 800px)" srcset="https://gitdata.xuanhun520.com/api/starimg?repos=visactor/vchart&type=Date&theme=dark" />
  <source media="(prefers-color-scheme: light) and (max-width: 800px)" srcset="https://gitdata.xuanhun520.com/api/starimg?repos=visactor/vchart&type=Date" />
  <img style="width: 800px; height: 533px;" alt="Star History Chart" src="https://gitdata.xuanhun520.com/api/starimg?repos=visactor/vchart&type=Date" />
</picture>

👆 **ESTE** es un gráfico **`en vivo`** creado con el siguiente código HTML: 👇

<div align="left">

```html
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://gitdata.xuanhun520.com/api/starimg?repos=visactor/vchart&type=Date&theme=dark" />
  <source media="(prefers-color-scheme: light)" srcset="https://gitdata.xuanhun520.com/api/starimg?repos=visactor/vchart&type=Date" />
  <img style="width: 800px; height: 533px;" alt="Star History Chart" src="https://gitdata.xuanhun520.com/api/starimg?repos=visactor/vchart&type=Date" />
</picture>
```

</div>

</div>

---

## ✨ Características

- Basado en [VChart](https://github.com/VisActor/VChart).
- Soporte para ver datos detallados
- Generación **con un clic** de imágenes de gráficos **de alta calidad**;
- Soporte para **múltiples modos de vista** de gráficos, **`basados en fecha o línea de tiempo`**;
- **Incrustar** **gráficos en tiempo real** en **`GitHub readme u otros sitios web`** **(como el ejemplo que incrustamos en la parte superior)**;
- Y **varias** **funciones** útiles:
  - Alternar **visibilidad del repositorio**;
  - **Atajo** para ingresar el nombre del repositorio;
  - **Compartir rápidamente** en **`redes sociales`**;
  - **Soporte** para ingresar **múltiples repositorios**;
  - ...¡más funciones esperando que las **descubras!**

## 🌠 Capturas de pantalla

<a href="https://gitdata.xuanhun520.com"><img width="800px" src="https://user-images.githubusercontent.com/24653555/154391264-312b448b-f851-41bf-bb8d-4c21ec6795b6.gif" />
</a>



## 🏗 Desarrollo

**`Star-history`** está construido usando una **pila tecnológica moderna**: **`Vue`** + **`Vite`** + **`TailwindCSS`** + **`@Visactor/VChart`**.

### Requisitos previos

- [Node.js](https://nodejs.org/en/download/)
- [pnpm](https://pnpm.io/)
- [MongoDB](https://www.mongodb.com/)

### Instalar dependencias

```shell
pnpm i
```

### Iniciar desarrollo

- **Sitio web principal** es la página de inicio de gitdata, que contiene la mayoría de las **características útiles y blogs** sobre **`VisActor código abierto`**.

  ```shell
  pnpm dev
  ```

  El sitio web se servirá en http://localhost:3000.

- **Servidor API** es una **`característica experimental`**. Se utiliza principalmente para **generar archivos de imagen de gráficos `SVG` o `PNG`** que se pueden incrustar en **`GitHub readme`**.

  #### Requisitos previos para el servidor API

  - [MongoDB Community Server](https://www.mongodb.com/try/download/community) (para almacenar en caché datos del repositorio)

  #### Instalar MongoDB Community Server

  **Nota:** Después de cambiar la contraseña, recuerda actualizar la cadena de conexión en tu archivo `.env` o variables de entorno.

  **Establecer variables de entorno:**

  La configuración de MongoDB se puede modificar según tu situación real.

  ```shell
  # Establecer cadena de conexión de MongoDB
  export MONGODB_URI="mongodb://[username]:[password]@localhost:27017/gitdata"
  export MONGODB_DB_NAME="gitdata"
  export MONGODB_COLLECTION_NAME="repo_cache"
  ```

  O crear un archivo `.env` en el directorio `server`:

  ```env
  MONGODB_URI=mongodb://xuanhun:xuanhun@localhost:27017/gitdata
  MONGODB_DB_NAME=gitdata
  MONGODB_COLLECTION_NAME=repo_cache
  ```

  #### Iniciar servidor API

  ```shell
  cd server
  pnpm i && pnpm dev
  ```

  El servidor API se ejecutará en http://localhost:8080 (o https://localhost:8080 si HTTPS está habilitado).

  #### Token

  El servicio backend requiere tu propio token de GitHub, colocado en el archivo `token.env`.

  ### Habilitar soporte HTTPS

  Para habilitar HTTPS para el frontend:

  1. **Generar certificados SSL** (para desarrollo):

     ```shell
     ./scripts/generate-ssl-cert.sh
     ```

     Esto creará certificados autofirmados en el directorio `certs/`.

  2. **Para Frontend (Vite)**:

     El servidor de desarrollo Vite usará automáticamente HTTPS si se encuentran certificados en el directorio `certs/`, o puedes especificar rutas personalizadas:

     ```shell
     export SSL_CERT_PATH=/path/to/cert.crt
     export SSL_KEY_PATH=/path/to/key.key
     pnpm dev
     ```

## Planes futuros

- Agregar más funciones de edición y anotación
- Ver y editar código VChart, exportar al editor oficial de VChart
- Generar videos animados del historial de estrellas (GIF)
- Más estadísticas y funciones de análisis de datos de GitHub
