## Scaffold template fields

This plugin proposes different UI fields to be used part of a template scaffolded by backstage:

| Name                                                        | Description                                                                                                                     |
|-------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------|
| [QuarkusExtensionList](#Quarkus-extensions-field)           | Filter, select your Quarkus extensions using the `Quarkus Extension List` field.                                                |
| [QuarkusQuickstartPicker](#Quarkus-Quickstart-picker-field) | Select using the `Quarkus QuickStart Picker` one of the quickstarts available: https://github.com/quarkusio/quarkus-quickstarts |
| [QuarkusVersionList](#Quarkus-version-list-field)           | List the recommended and available versions of Quarkus                                                                          |


**NOTE**: Such frontend feature(s) should be used with the quarkus scaffolder backend plugin !

To use them, import the needed package under the following path within an existing backstage application:
```
yarn add --cwd packages/app "@qshift/plugin-quarkus"
```

Next, customize the `packages/app/src/App.tsx` file according to the field that you plan to use and described hereafter

### Local development

When you develop a new `<ScaffolderFieldExtensions/>`, then we recommend
to launch the plugin locally using the `createDevApp` of the `./dev/index.tsx` file for testing/debugging purposes.

To play with it, open a terminal and run the command: `yarn start` within the `./plugins/quarkus` folder

**NOTE:** Don't forget to open a second terminal and to launch the backend or [backend-next](../../docs/backend-system/index.md) there, using `yarn start` and to specify the locations of the templates to play with !

If your IDE supports to debug an application that is running on the localhost in the development mode like [IntelliJ](https://www.jetbrains.com/help/idea/debugging-javascript-in-chrome.html#debugging_js_on_local_host_development_mode), then use the commands "Command + Shift" and click on the url: `http://localhost:3000`, next add a breakpoint within your tsx file

![local-debug.png](doc%2Flocal-debug.png)

### Quarkus extensions field

This field allows a user to pick up Quarkus extension(s) from the code generator server.

Edit the `packages/app/src/App.tsx` file to add the tag of the `<QuarkusExtensionListField />`
within the tag `<Route path="/create" element={<ScaffolderPage />}>` as described hereafter.

```tsx
...
import { ScaffolderFieldExtensions } from '@backstage/plugin-scaffolder-react';
import { QuarkusExtensionListField } from '@qshift/plugin-quarkus';
...
    <Route path="/create" element={<ScaffolderPage />}>
      <ScaffolderFieldExtensions>
        <QuarkusExtensionListField />
      </ScaffolderFieldExtensions>
...
```

Update your template file to use extension field:
```yaml
apiVersion: scaffolder.backstage.io/v1beta3
kind: Template
metadata:
  name: quarkus-application
  title: Create a Quarkus Application
  description: Create a Quarkus application using code generator "code.quarkus.io"
  tags:
    - quarkus
    - java
spec:
  owner: guests
  type: service

  parameters:
  ...
  - title: Customize the Quarkus application features
    properties:
      extensions:
        title: Quarkus Extensions
        type: array
        description: The list of the quarkus extensions
        ui:field: QuarkusExtensionList
  steps:
  ...
```

When done, you will be able to select your extension(s) when you scaffold a new project.

It is also possible to filter the extensions (aka restrict the list of the extensions to be used):
```yaml
    ui:field: QuarkusExtensionList
    ui:options:
      filter:
        extensions:
          - io.quarkus:quarkus-resteasy-reactive-jackson
          - io.quarkus:quarkus-smallrye-openapi
          - io.quarkus:quarkus-smallrye-graphql
          - io.quarkus:quarkus-hibernate-orm-rest-data-panache
```
If you would like to use a different code generator server, set the following property
```yaml
    ui:field: QuarkusExtensionList
    ui:options:
        codeQuarkusUrl: https://staging.code.quarkus.io
```

Quarkus Extension List - default (field):
![extensions-1.png](plugins%2Fquarkus%2Fdoc%2Fextensions-1.png)

Quarkus Extension List - Select (field):
![extensions-2.png](plugins%2Fquarkus%2Fdoc%2Fextensions-2.png)

Quarkus Extension List - Added (field):
![extensions-3.png](plugins%2Fquarkus%2Fdoc%2Fextensions-3.png)

### Quarkus Quickstart picker field

This field allows a user to pick up a Quarkus Quickstart project.

Edit the `packages/app/src/App.tsx` file to add the tag of the `<QuarkusQuickstartPickerField />`
within the `<Route path="/create" element={<ScaffolderPage />}>` as described hereafter.

```tsx
...
import { ScaffolderFieldExtensions } from '@backstage/plugin-scaffolder-react';
import { QuarkusQuickstartPickerField } from '@qshift/plugin-quarkus';
...
    <Route path="/create" element={<ScaffolderPage />}>
      <ScaffolderFieldExtensions>
        <QuarkusQuickstartPickerField />
      </ScaffolderFieldExtensions>
...
```

Update your template file to use extension field:
```yaml
apiVersion: scaffolder.backstage.io/v1beta3
kind: Template
metadata:
  name: quarkus-quickstart
  title: Create a Quarkus Application from a Quickstart
  description: Create a Quarkus Application from one of the Quickstarts you can find on "https://github.com/quarkusio/quarkus-quickstarts"
  tags:
    - quarkus
    - java
spec:
  owner: guests
  type: service

  parameters:
  ...
  - title: Select the Quarkus Quickstart
    properties:
      quickstartName:
        title: Quickstart Name
        type: string
        description: The name of the quickstart to clone
        default: 'hibernate-orm-panache'
        ui:field: QuarkusQuickstartPicker
  steps:
  ...
```

When done, you will be able to create a new Quarkus project from the quickstart selected.

Quarkus Quickstart Picker - default (field):
![quickstart-1.png](/plugins/quarkus/doc/quickstart-1.png)

Quarkus Quickstart Picker - select (field):
![quickstart-2.png](/plugins/quarkus/doc/quickstart-2.png)

### Quarkus Version list field

This field allows a user to select a Quarkus version from the list of the recommended and available version.

Edit the `packages/app/src/App.tsx` file to add the tag of the `<QuarkusQuickstartPickerField />`
within the `<Route path="/create" element={<ScaffolderPage />}>` as described hereafter.

```tsx
...
import { ScaffolderFieldExtensions } from '@backstage/plugin-scaffolder-react';
import { QuarkusVersionListField } from '@qshift/plugin-quarkus';
...
    <Route path="/create" element={<ScaffolderPage />}>
      <ScaffolderFieldExtensions>
        <QuarkusQuickstartPickerField />
      </ScaffolderFieldExtensions>
...
```
Update your template file to use extension field:
```yaml
apiVersion: scaffolder.backstage.io/v1beta3
kind: Template
metadata:
  name: quarkus-application
  title: Create a Quarkus Application
  description: Create a Quarkus application using code generator "code.quarkus.io"
  tags:
    - quarkus
    - java
spec:
  owner: guests
  type: service

  parameters:
  ...
  - title: Customize the Quarkus application features
    properties:
      quarkusVersion:
      title: Quarkus version
      type: array
      description: The list of the quarkus supported/recommended
      ui:field: QuarkusVersionList
      
  steps:
  ...
```

When done, you will be able to select the quarkus version to be used to scaffold 
your quarkus project

Quarkus Version list - Select (field):
![version-list.png](/plugins/quarkus/doc/version-list.png)

Quarkus Version list - Recommended (field):
![version-recommended.png](/plugins/quarkus/doc/version-recommended.png)