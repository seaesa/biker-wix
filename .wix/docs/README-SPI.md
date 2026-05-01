# The SPI Folder for Service Plugins

Service plugins allow you to add your own custom logic to existing Wix app flows and to integrate services from 3rd party providers. 

The implementation process includes the following steps:  
1. Create a new service plugin on a site using the Wix Studio Code panel. 
2. Implement your custom code in the Wix IDE. 
3. Deploy the service plugin by publishing the site. 

Learn more about [service plugins](https://dev.wix.com/docs/develop-websites/articles/coding-with-velo/integrations/service-plugins-formerly-spis/about-service-plugins).

## Create a service plugin 

To create a service plugin: 

1. From the Wix Studio Code panel, click **Backend & Public**. 
2. Next to Service Plugins, click the **+** icon. 
3. Select the service plugin you want to add. 
4. Follow the prompts in the modal and give the plugin a name. 

Learn more about the [available service plugins](https://dev.wix.com/docs/develop-websites/articles/coding-with-velo/integrations/service-plugins-formerly-spis/available-service-plugins).

When you add a service plugin in the Code panel, Wix automatically creates a new folder under `src/backend/__spi__`.
The folder name reflects the plugin you selected. It contains a nested subfolder with your plugin's name and default files.  

> **Note:** You must add all service plugins from the Code panel. Don't manually create the folders and files directly in the Wix IDE. If you try to add a service plugin from the Wix IDE, it won't work.

## Service plugin folders and files 

The `src/backend/___spi___` folder contains a subfolder for each type of service plugin on a site. For example, if you add the Shipping Rates service plugin, you see the following structure: 

```tsx
.
└── src/
    └── backend/
        └── ___spi___/
            └── ecom-shipping-rates/
                └── <your-plugin-name>/
                    ├── <your-plugin-name>-config.js
                    └── <your-plugin-name>.js
```

You can have multiple folders for each type of service plugin. 

### Default files

Each service plugin folder holds the following default files: 

+ `<your-plugin-name>-config.js`: The code in this file defines a method that returns an object containing values used to configure the service plugin.
+ `<your-plugin-name>.js`: The code in this file defines a method named after the service plugin's purpose, such as `getShippingRates()` or `getFees()`. Wix calls this method to retrieve the data your plugin provides.

Implement the custom code for your service plugins in these files in the Wix IDE. 

### Additional .js files

You can add more files to your service plugin's folder as necessary. For example, you might not want to keep all your code in the default service plugin files. 

To import from these files to the default service plugin files, use the following syntax:

```js
import { methodName } from './<yourFileName>.js';
```

## Legal notices and limitations

+ When you connect to a 3rd-party provider with service plugins, you agree to the [Wix.com Terms of Use](https://www.wix.com/about/terms-of-use). Wix isn't responsible for your use of 3rd-party providers. Any liability from such use is your responsibility.
+ Currently, you can't add service plugins to a site when using [Git Integration & Wix CLI for Sites](https://dev.wix.com/docs/develop-websites/articles/workspace-tools/developer-tools/git-integration-wix-cli-for-sites/about-git-integration-wix-cli-for-sites).
+ Service plugin names can't contain spaces or special characters.
+ You can't import additional `.js` files from relative paths in a site's repo.
+ You must create service plugins through the Wix Studio Code panel. You can't create them manually in the Wix IDE. 