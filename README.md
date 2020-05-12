# react-use-uuid

When building a Component using React Hooks, there are instances where a unique id is necessary. With React class components one could simply generate an ID and store it as a property on the class instances (not state, though there is nothing wrong with using state). An unfortunate side effect of Hooks is that they aren't class instances and we must rely on a new paradigm for generating a unique id for the lifetime of our component.

`useId` does just that by creating a memoized id generator. The benefit is two-fold. First, the id generator only runs on the first render, saving us from wasting time generating ids that won't be used. Second, our id never changes for the entire lifecycle of our component, giving us a bit more reliability when using said id.

## How to use it

```javascript
import React, { useCallback, useEffect } from 'react';
import useId from 'react-use-uuid';

function MyComponent() {
    const id = useId();
    const onDrop = useCallback((files) => console.log(`Received ${files.length} files`));

    useEffect(() => {
        // Third party code with limited integration
        Aspera.Connect.setDragDropTargets(`#${id}`, onDrop);
    }, []);

    return(
        <div id={id}>
            Drop your files here
        </div>
    );
}
```

## Use a different version of UUID ID generation

Behind the scenes, useId makes use of the powerful [uuid package](https://www.npmjs.com/package/uuid). By default, version 4 of the id generation is used but all versions are supported through an optional parameter to `useId`.

```javascript
import React, { useCallback, useEffect } from 'react';
import useId from 'react-use-uuid';
import uuidv5 from 'uuid/v5';

function MyComponent() {
    const id = useId('v5', 'hello.example.com', uuidv5.DNS);
    const onDrop = useCallback((files) => console.log(`Received ${files.length} files`));

    useEffect(() => {
        // Third party code with limited integration
        Aspera.Connect.setDragDropTargets(`#${id}`, onDrop);
    }, []);

    return(
        <div id={id}>
            Drop your files here
        </div>
    );
}
```

## Custom id hook

If you find your application needs v3 or v5 of uuid, which require additional
properties to generate an id, create a custom hook to keep your code readable
and DRY.

```javascript
// UseCustomId.js
import useId from 'react-use-uuid';
import uuidv5 from 'uuid/v5';

function useCustomId() {
    return useId('v5', 'hello.example.com', uuidv5.DNS);
}
```

```javascript
// MyComponent.js
import React, { useCallback, useEffect } from 'react';
import useCustomId from './useCustomId';

function MyComponent() {
    const id = useCustomId();
    const onDrop = useCallback((files) => console.log(`Received ${files.length} files`));

    useEffect(() => {
        // Third party code with limited integration
        Aspera.Connect.setDragDropTargets(`#${id}`, onDrop);
    }, []);

    return(
        <div id={id}>
            Drop your files here
        </div>
    );
}
```
