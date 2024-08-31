# File uploader widget

File uploader is one of widgets admin panel. It allows upload files and images or single file and image

all options is optional

```javascript
module.exports.adminpanel = {
    models: {
        users: {
            title: 'Users', 
            model: 'User', 

            fields: {
                email: 'User Email', 
                avatar: false,
            },
            add: {
                avatar: {
                    title: "FilesUploader",
                    type: "file",
                    options: { // widget configuration
                        filesize: 2, 
                        accepted: ['pdf', 'avi']
                    }
                }         
            }
        }
    }
}
```

File uploader widget save files in `.tmp/public/admin/uploads/%entityName%/%fieldName%` and save data about file in field, that provide this widget.

Option `file` to set location uploaded one file

## Widget configuration

### File Uploader
Provides widget for upload only one file. If you upload new file, old will be forgotten


```metadata json
{
    type: "file",
    options: { 
        file: './.tmp/upload/any.conf', // path for upload file (optional)
        filesize: number,  // max size of file in Mb, by default 1
        accepted: ['conf'] // accepted extensions for upload
    }
}
```

### Files Uploader
Provides widget for upload a many files. You can change order, add and remove files uses this widget. 

```metadata json
{
    type: "files",
    options: { 
        filesize: number,  // max size of file in Mb, by default 1
        accepted: string[] // accepted extensions for upload
    }
}

```

### Image Uploader
Provides widget for upload a one images. Save image and a few resize. 
Default resize is small and large. You can add your own resize.

If passed `file` option resize will be ignored,

```metadata json

{
    type: "image", (required)
    options: {
        filesize: number,  // max size of file in Mb, by default 1
        accepted: string[], // accepted extensions for upload
        small: number, // size of thumbl version of image
        large: number, // size of large verison of image
        aspect: { // aspect of image, optional. Validate image aspect after upload on server and image can be refused if aspect not valid.
            width: number, // horizontal aspect
            height: number // vertical aspect
        },
        size: { //image size, optional
            width: number or string that contain number or string array,
            height: number or string that contain number or string array
        },
        resize: [ //cusom resize, optional
            {
                name: string, //resize name
                w: number // width 
                h: number //height
            }
        ]
    }
}

```

### Gallery Uploader
Provides widget for upload a many images. Save image and a few resize. Default resize is small and large. You can add your own resize.

```metadata json

{
    type: "images",
    options: { 
        filesize: number,  // max size of file in Mb, by default 1
        accepted: string[], // accepted extensions for upload
        small: number, // size of thumbl version of image
        large: number, // size of large verison of image
        aspect: { // aspect of image, optional. Validate image aspect after upload on server and image can be refused if aspect not valid.
            width: number, // horizontal aspect
            height: number // vertical aspect
        },
        size: { //image size, optional
            width: number or string that contain number or string array,
            height: number or string that contain number or string array
        },
        resize: [ //cusom resize, optional
            {
                name: string, //resize name
                w: number // width 
                h: number //height
            }
        ]
    }
}

```

#### Size

You can add size validation of uploaded images. 
```metadata json
size: {
    width: number, // image width
    height: number // image height
}
```

You can use stings, for example:
```metadata json
size: {
    width: '200',
    height: '300'
}
```

Also, you can set range of width or height:
```metadata json
size: {
    width: '>=200',
    height: ['>100', '<=300']
}
```

#### Preview (deprecated)
Gallery let you choice preview of images set using preview property

Usage example

```javascript
// MODEL User.js:
module.exports = {
  attributes: {
    photos: 'json',
    photosPreview: 'string'
  }
}
```

```javascript
module.exports.adminpanel = {
    models: {
        users: {
            title: 'Users', 
            model: 'User', 

            fields: {
                photos: false,
                preview: false
            },
            add: {
                photos: {
                    title: "GalleryUploader",
                    type: "images",
                    options: {
                        preview: 'photosPreview'
                    }
                }
            }
        }
    }
}
```
