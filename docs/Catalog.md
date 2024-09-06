# Catalog

Create tree structure catalogs based on models or any other elements
All catalogs must be added to the [CatalogHandler](#CatalogHandler) catalog handler

### Catalog Items
Each item within the catalog, whether it's a file or a group of files, is represented as an object of the `BaseItem` class. This class is also abstract and defines common properties and methods for all types of items. Items can be organized into a tree structure, allowing for hierarchical management and grouping.

### Context Menu and Actions
Catalogs support the creation of a context menu, which can be invoked by right-clicking or through a mobile interface. This menu allows users to perform various actions on catalog items, such as adding, editing, deleting, and moving items. These actions are implemented using `ActionHandler` classes, which define how each action should be executed.

### Mobile Catalog
Catalogs also support user interaction on mobile devices, providing access to the same functions available on desktop computers through adapted mobile interfaces. Actions and the context menu can be triggered through special gestures or buttons, ensuring usability across all platforms.

### Versatility of the Catalog
The catalog can be used for any tree-like structures where items can be opened, edited, and actions can be performed, including the ability to drag and drop these structures. It is ideally suited for creating product catalogs in stores and was originally designed with this purpose in mind.

**For an example of the implementation, see the [Navigation](../lib/catalog/Navigation.ts)**

Use links in adminpanel **/admin/catalog/:slug/:id**

***

## AbstractCatalog Class Documentation

This class is an abstract class that serves as a base for creating catalog objects. It provides methods for managing catalog items, actions, and access rights.

### Properties

- id: A string that represents the unique identifier for the catalog.
- name: An abstract string that represents the name of the catalog.
- slug: An abstract string that represents the slug of the catalog.
- movingGroupsRootOnly: A boolean that indicates whether groups should be moved to the root only.
- actionHandlers: An array of ActionHandler objects that represent the global contexts for the catalog.
- icon: An abstract string that represents the icon of the catalog.
- itemTypes: An array of BaseItem<Item> objects that represent the types of elements in the catalog.

### Methods

- getChilds(parentId: string | number | null, byItemType?: string): Promise<Item[]>: A method that returns an array of items that are children of the specified parent.
- getItemType(type: string): BaseItem<Item>: A method that returns the BaseItem<Item> object for the specified type.
- additemTypes(itemType: BaseItem<any>): A method that adds a BaseItem<any> object to the catalog.
- find(item: Item): Promise<Item>: A method that returns the item with the specified id.
- deleteItem(type: string, id: string | number): A method that deletes the item with the specified id.
- getEditHTML(item: Item, id: string | number, loc: string, modelId?: string | number): A method that returns the HTML for editing the specified item.
- getAddHTML(item: Item, loc: string): A method that returns the HTML for adding a new item.
- addActionHandler(actionHandler: ActionHandler): A method that adds an ActionHandler to the catalog.
- getActions(items?: Item[]): Promise<ActionHandler[]>: A method that returns an array of ActionHandler objects for the specified items.
- handleAction(actionId: string, items?: Item[], config?: any): Promise<void>: A method that handles the execution of the specified action.
- getLink(actionId: string): Promise<string>: A method that returns the link for the specified action.
- getPopUpHTML(actionId: string): Promise<string>: A method that returns the HTML for the specified action.
- createItem(data: T): Promise<T>: A method that creates a new item with the specified data.
- updateItem(id: string | number, type: string, data: T): Promise<T>: A method that updates the item with the specified id.
- updateModelItems(modelId: string | number, type: string, data: T): Promise<T>: A method that updates all items in the tree after updating the model.
- getitemTypes(): BaseItem<Item>[]: A method that returns an array of BaseItem<Item> objects.
- search(s: string, hasExtras: boolean = true): Promise<T[]>: A method that searches for items in the catalog.
- static buildTree(items: Item[]): Item[]: A static method that builds a tree from an array of items.

### Constructor

The constructor takes an array of BaseItem<any> objects and initializes the catalog with them. It also binds the access rights for the catalog.

***

## BaseItem class documentation

This is an abstract class that serves as a base for all catalog items. It defines the common properties and methods that all catalog items should have.

### Properties

- type: An abstract property that should be implemented in each concrete class. It represents the type of the item.
- name: An abstract property that should be implemented in each concrete class. It represents the name of the catalog.
- isGroup: An abstract property that should be implemented in each concrete class. It represents whether the item is a group or not.
- allowedRoot: An abstract property that should be implemented in each concrete class. It represents whether it is allowed to add an element to the root.
- icon: An abstract property that should be implemented in each concrete class. It represents the icon of the item.
- actionHandlers: An array of action handlers that will be available for all items.

### Methods

- addActionHandler(contextHandler: ActionHandler): Adds a new action handler to the list of available action handlers.
- find(itemId: string | number, catalogId: string): An abstract method that should be implemented in each concrete class. It represents the logic of finding an item by its id.
- update(itemId: string | number, data: T, catalogId: string): An abstract method that should be implemented in each concrete class. It represents the logic of updating an item.
- updateModelItems(modelId: string | number, data: any, catalogId: string): An abstract method that should be implemented in each concrete class. It represents the logic of updating model items.
- create(data: T, catalogId: string): An abstract method that should be implemented in each concrete class. It represents the logic of creating a new item.
- deleteItem(itemId: string | number, catalogId: string): An abstract method that should be implemented in each concrete class. It represents the logic of deleting an item.
- getAddHTML(loc: string): An abstract method that should be implemented in each concrete class. It represents the logic of getting the HTML for adding a new item.
- getEditHTML(id: string | number, catalogId: string, loc: string, modelId?: string | number): An abstract method that should be implemented in each concrete class. It represents the logic of getting the HTML for editing an item.
- getChilds(parentId: string | number | null, catalogId: string): An abstract method that should be implemented in each concrete class. It represents the logic of finding child items of a parent item.
- search(s: string, catalogId: string): An abstract method that should be implemented in each concrete class. It represents the logic of searching for items.

## AbstractGroup class documentation

This is an abstract class that extends the BaseItem class. It represents a group of catalog items.

### Properties

- type: A property that represents the type of the item. It is set to "group".
- isGroup: A property that represents whether the item is a group or not. It is set to true.
- icon: A property that represents the icon of the item. It is set to "folder".

## AbstractItem class documentation

This is an abstract class that extends the BaseItem class. It represents a single catalog item.

### Properties

- isGroup: A property that represents whether the item is a group or not. It is set to false.

***

## ActionHandler Class Documentation

This class represents an abstract base class for handling actions in a system. It defines the structure and methods that any concrete action handler class must implement.

### Abstract Properties

- type: An abstract property that defines the type of action. It can be one of the following values: "basic", "json-forms", "external", "link", or "partial".
- displayContext: An abstract property that determines whether the action should be displayed in the context menu section.
- displayTool: An abstract property that determines whether the action should be displayed in the toolbox section.
- uiSchema: An abstract property that represents the UI schema for "json-forms" type actions.
- jsonSchema: An abstract property that represents the JSON schema for "json-forms" type actions.
- selectedItemTypes: A property that defines the types of elements for which the action can be used.
- id: An abstract property that represents the unique identifier for the action.
- icon: An abstract property that represents the icon for the action. It can be a URL or an ID.
- name: An abstract property that represents the name of the action.

### Abstract Methods

- getPopUpHTML(data?: any): Promise<string>: An abstract method that returns the HTML content for the pop-up. This method is used for "json-forms" and "external" type actions.
- getLink(data?: any): Promise<string>: An abstract method that returns the link for the "link" type actions.
- handler(items: Item[], data?: any): Promise<void>: An abstract method that represents the implementation of a method that will do something with the selected items.

### Notes

- The "json-forms" type actions require a UI schema and a JSON schema.
- The "external" type actions use the getPopUpHTML method to display the HTML content in a pop-up.
- The "link" type actions use the getLink method to return a link.
- The handler method is responsible for performing the actual action on the selected items.

***

## CatalogHandler

This class is a handler for a list of catalogs. It provides methods to add a catalog, get all catalogs, and find a catalog by its slug.

### Methods

#### add(catalog: AbstractCatalog)

This method adds a catalog to the list of catalogs.

Parameters:

- catalog: An instance of the AbstractCatalog class.

Returns:

- The added catalog.

#### getAll()

This method returns all catalogs in the list.

Returns:

- An array of AbstractCatalog instances.

#### getCatalog(slug: string)

This method finds a catalog by its slug.

Parameters:

- slug: A string that represents the slug of the catalog.

Returns:

- An instance of the AbstractCatalog class if found, otherwise null.
