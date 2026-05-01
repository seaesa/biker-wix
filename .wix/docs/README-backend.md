# The Backend Folder

The `src/backend` folder contains the backend code files for your site. Backend code files for Wix sites are written in JavaScript and run using the Node.js runtime environment.

## File types

Wix supports specialized backend files that perform different functions. Add the following files to the backend folder to include them in your site:
+ **Web Method files:**  
  These are files that allow you to expose functions in your site's backend that you can run in your frontend code. These files require a `.web.js` file extension. Learn more about [web methods](https://support.wix.com/en/article/about-web-methods).

+ **data.js**.  
  A file for [adding data hooks](https://support.wix.com/en/article/velo-using-data-hooks) to your site's collections.

+ **routers.js**  
  A file for implementing [routing and sitemap](https://support.wix.com/en/article/velo-about-routers#routing-code) functionality for your site.

+ **events.js**  
  A file for implementing your site's [backend event handlers](https://support.wix.com/en/article/velo-backend-events). 

+ **http-functions.js**  
  A file for implementing [HTTP endpoints](https://www.wix.com/velo/reference/wix-http-functions/introduction) that are exposed on your site.

+ **jobs.config**  
  A file for [scheduling recurring jobs](https://support.wix.com/en/article/velo-scheduling-recurring-jobs). Jobs consist of backend code that's run at regular intervals.
  
+ **General backend files**  
  JavaScript code files. You can import code from these files into any other backend file on your site. These files require a `.js` file extension.

## Import code from other files

To import functions from other code files to use in your backend code, use the following syntax. Trying to import from the relative path in your site's files doesn't work.

For public code files:

```javascript
import {functionName} from 'public/myFileName';
```

For other backend code files:

```javascript
import {functionName} from 'backend/myFileName';
```

## SPI folder
If you add [service plugins](https://dev.wix.com/docs/develop-websites/articles/coding-with-velo/integrations/service-plugins-formerly-spis/about-service-plugins) to your site, the backend folder contains a folder called `__spi__`. This folder contains subfolders with the code files for each plugin. 

Learn more about the [`__spi__`](/.wix/docs/README-SPI.md) folder and about [implementing service plugins](https://dev.wix.com/docs/develop-websites/articles/coding-with-velo/integrations/service-plugins-formerly-spis/implement-service-plugins).

## permissions.json (Deprecated)

The backend folder contains a `permissions.json` file. This file was previously used to configure permissions for backend functions exported from `.jsw` web modules. 

Web modules defined using `.jsw` file extensions are deprecated. They have been replaced with [web modules defined by `.web.js` extensions](https://dev.wix.com/docs/develop-websites/articles/coding-with-velo/backend-code/web-modules/about-web-modules). For details about the deprecated `permissions.json` files for `.jsw` web modules, see [Call Backend Code from the Frontend Using a jsw Web Module](https://dev.wix.com/docs/develop-websites/articles/coding-with-velo/backend-code/web-modules/call-backend-code-from-a-jsw-web-module). 


Learn more about the [Wix IDE](https://support.wix.com/en/article/about-the-wix-ide).