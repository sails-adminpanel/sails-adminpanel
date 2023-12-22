# Dashboard

> init from version: 2.6.0

to enable dashboard need configure it 

if dashboard disabled you can configure welcome message

```
module.exports.adminpanel = { 
  dashboard: false,
  welcome: {
     title: "Welcome",
     text: "Any text here"
  }
};

```


```
module.exports.adminpanel = {
    dashboard: {
        enable: true
    }
}
```

or 

```
module.exports.adminpanel = {
    dashboard: true
}

```




# Dashboard widgets
