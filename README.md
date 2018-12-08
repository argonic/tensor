# Tensor

[![Build Status](https://travis-ci.org/argonic/tensor.svg?branch=master)](https://travis-ci.org/argonic/tensor) [![codecov](https://codecov.io/gh/argonic/tensor/branch/master/graph/badge.svg)](https://codecov.io/gh/argonic/tensor)  [![npm (scoped)](https://img.shields.io/npm/v/@argonic/tensor.svg)](https://www.npmjs.com/package/@argonic/tensor)  ![DUB](https://img.shields.io/dub/l/vibe-d.svg)   [![Prettier code style](https://img.shields.io/badge/code%20style-prettier-ff69b4.svg)](https://github.com/argonic/tensor) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com) [![Github All Releases](https://img.shields.io/github/downloads/argonic/tensor/total.svg)]() [![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/dwyl/esta/issues)

### Introduction
____
Tensors are multidimensional vector spaces that maps in a (multi-)linear manner to vectors, scalars, and other tensors to a resulting tensor.

A tensor of type (p, q) is an assignment of a multidimensional array $$T^{i_1 \dots i_p}_{j_1 \dots j_q} [f]$$ to each basis $$f = (e_1, \dots ,e_n)$$ of an n-dimensional vector space such that, if we apply the change of basis. $$f \mapsto f .  R = (e_i R^i_1, \dots , e_i R^i_n)$$

Where $$i$$ is the $$i$$ th dimension, ranging from one to $$n$$ rank. the number $$j$$ is being the depth of the $$i$$ th dimension, ranging from one to $$q$$ dimension.
A tensor is composed of subsequent tensors with the $$n$$ th tensors being composed of scalars.
Scalars or "scaled" numbers, called scalars. Scalars are tensor's primitive elements and often taken to be real numbers, but there are also vector spaces with scalar multiplication by complex numbers, rational numbers, or generally any field.

#### Features
____
- Browser and server support out of the box, thanks to `Webpack`
- Full integration within the Typescript ecosystem
- Fully tested with 100% code coverage
- Lightweight with production zero-dependencies
- Optimized for performance
- Learning purposes
- Tensor class:
    - The creation of tensors of $$p$$ rank/dimensions
    - TypedArray as the flat tensor vector
    - Calculate tensor's length $$L = q_1 \times q_2 \dots q_p$$
    - Calculate strides $$S^i = 1 \times q_{p-i} \times q_{p-i+1} \dots q_i$$
    - Calculate indices out of coordinates $$I = (C_1 \times S_1) + (C_2 \times S_2) \dots C_i \times S_i$$
    - Calculate coordinates out of indices $$C_i(I) = r_i(I)/S_i$$ such as $$r_i(I) = I - (C_{i-1} \times S_{i-1})$$
    - Calculate transpose
    - Just in time tensor filling using scalars or closure evaluation
    - Get indice or coordinates values
    - Update indice or coordinates values
    - Transfer tensor's content to another tensor with/out instantiating another Tensor object


## Table of contents
____
1. Installation
2. Getting started
3. Documentation
4. The API
5. Examples

### Installation
____
The easiest way to use Tensor, is by adding it to your local package by runing this command:
```
$ npm i @argonic/tensor --save
```
*Note: To run the preceding command, Node.js and npm must be installed.*

If you want to use Tensor in the browser, you can download it here:
[Download Here](https://raw.githubusercontent.com/argonic/tensor/master/build/tensor.js)
### Getting started
To use Tensor as a node module, add this code to your `.js` file:
```javascript
const Tensor = require("@argonic/tensor");
```
or using ECMA6 syntax:
```javascript
import Tensor from "@argonic/tensor";
```
___
To use Tensor in the browser, add the script to your HTML file:
```html
<script lang="javascript" src="https://raw.githubusercontent.com/argonic/tensor/master/build/tensor.js"></script>
```
And you can access the Tensor class using `.default` property:
```javascript
const TensorClass = Tensor.default;
```
### Documentation
____
#### `Constructor`
____
###### `new Tensor(TypedArrayConstructor, shape, ...shape)`
The main function in Tensor class, It creates an n-dimensional tensor and maps it to 1D array view.

* `TypedArrayConstructor`: the constructor you wich to use in the storage buffer. e.g.: `new Tensor(Uint8Array, 1);` which creates a 1D tensor over a Uint8Array typed array.
* `shape`: a natural number where shape > 0, it is the depth of each dimension.

*Note: tensors are per default filled with zeros.*

`return`: a Tensor object.
```typescript
const tensor1 = new Tensor(Uint8Array, 256) // 1D tensor
const tensor2 = new Tensor(Float64Array, 23, 12); // 2D tensor
```
____
### Properties
* `tensor.min: number`: returns the tensor's min value.
* `tensor.max: number`: returns the tensor's max value.
* `tensor.length: number`: returns the tensor's length.
* `tensor.dimensions: number`: returns the tensor's dimensions/rank.
* `tensor.type: TypedArrayConstructor`: returns the tensor's type as TypedArrayConstructor.
* `tensor.strides: number[]`: returns the tensor's strides per dimension.
* `tensor.T: Tensor`: returns the tensor's tensor as a new Tensor object.
* `tensor.shape: number[]`: returns the tensor's shape array.
* `tensor.flat: TypedArray`: returns the tensor's flat TypedArray.
* `tensor.array: any[]`: returns the tensor's N-dimensional array.
### Methods
#### `Tensor.fill`
____
###### `Tensor.fill(value: (() => number) | number): Tensor;`
Fills the array with a scalar value or a closure evaluation that returns a scalar.

* `value`: either a scalar value generally a number, or a closure that evaluates to a scalar.

`return`: Tensor object.

```typescript
const tensor = new Tensor(Float64Array, 10)
tensor.fill(0); // fill with zeros
tensor.fill(Math.random); // fill with random values
```

#### `Tensor.flat`
____
###### `Tensor.flat: TypedArray = flat;`
Replaces the flat view using another TypedArray from the same type.

* `flat`: TypedArray from the same type, e.g.: `tensor.flat = new Uint8Array(1)` to replace a 1D Uint8Array tensor's flat array.

```typescript
const tensor = new Tensor(Float64Array, 10)
tensor.flat = new Float64Array(10).fill(1);
```


#### `Tensor.transpose`
____
###### `Tensor.transpose(...axes: number[]): Tensor;`
Permute the dimensions of an array. Transposing a 1-D array returns an unchanged view of the original array and Transposing a transpose return the same tensor.

* `axes`: if `axes.length === 0` it reverse the dimensions indices, otherwise permute the axes according to the values given.

`return`: a new Tensor with permuted dimensions.

```typescript
const tensor = new Tensor(Float64Array, 10)
const T = tensor.T;
// tensor.T.T.array is (deeply) equal to tensor.array
```

#### `Tensor.coordinates`
____
###### `Tensor.coordinates(index: number): number[];`
Takes an index as argument and returns the corresponding coordinates.

* `index`: an integer between 0 and (tensor.length-1).

`return`: coordinates array.

```typescript
const tensor = new Tensor(Float64Array, 10, 10, 10);
const coodrinates = tensor.coordinates(999);
// returns [10, 10, 10]
```

#### `Tensor.index`
____
###### `Tensor.index(...coordinates: number[]): number;`
Takes coordinates as argument and returns the corresponding index.

* `coordinates`: an integer between 0 and (tensor.shape[i]-1).

`return`: corresponding index.

```typescript
const tensor = new Tensor(Float64Array, 10, 10, 10);
const index = tensor.index([10, 10, 10]);
// returns 999
```


#### `Tensor.get`
____
###### `Tensor.get(...coordinates: number[]): number;`
Takes coordinates as argument, or an index and returns the corresponding index value.

* `coordinates`: an integer between 0 and (tensor.shape[i]-1).
* or one `index`:  an integer between 0 and (tensor.length-1).

`return`: corresponding index value.

```typescript
const tensor = new Tensor(Float64Array, 10, 10, 10);
const value = tensor.get(10, 10, 10);
// returns 0, since tensors are filled with zeros per default.
```

#### `Tensor.set`
____
###### `Tensor.set(value, ...coordinates: number[]): Tensor;`
Takes coordinates as argument, or an index and a value to update the corresponding index value.

* `value`: the new value.
* `coordinates`: an integer between 0 and (tensor.shape[i]-1).
* or one `index`:  an integer between 0 and (tensor.length-1).

`return`: Tensor object.

```typescript
const tensor = new Tensor(Float64Array, 10, 10, 10);
const value = tensor.set(252, 10, 10, 10);
// replace the 999 index value with 252
```


#### `Tensor.copy`
____
###### `Tensor.copy(tensor, instantiate?: boolean): Tensor;`
Copys data and metadata from the target tensor with or without instantiating a new tensor.

* `tensor`: the target tensor to copy data from.
* `instantiate`: boolean with default to `false`.

`return`: the same Tensor object if `instantiate` is false, or a new Tensor object if `instantiate` is set to `true`.

```typescript
const tensor1 = new Tensor(Float64Array, 10, 10, 10);
const tensor2 = new Tensor(Uint8Array, 252);
tensor2.copy(tensor1);
const tensor3 = tensor1.copy(tensor1); // return a new copy of tensor1
tensor2.length == tensor1.length; // true
tensor2.strides == tensor1.strides; // true
tensor2.dimensions == tensor1.dimensions; // true
tensor2.shape == tensor1.shape; // true
// ... etc
```


### The API
____
```typescript
type TypedArray = Uint8Array | Uint16Array | Uint32Array | Int8Array | Int16Array | Int32Array | Float32Array | Float64Array;
type TypedArrayConstructor = Uint8ArrayConstructor | Uint16ArrayConstructor | Uint32ArrayConstructor | Int8ArrayConstructor | Int16ArrayConstructor | Int32ArrayConstructor | Float32ArrayConstructor | Float64ArrayConstructor;

class Tensor {
    constructor(type: TypedArrayConstructor, ...shape: any[]);
    readonly max: number;
    readonly min: number;
    readonly length: number;
    readonly type: TypedArrayConstructor;
    readonly strides: number[];
    readonly dimensions: number;
    readonly filling: number;
    readonly filled: boolean;
    readonly shape: number[];
    readonly T: Tensor;
    readonly array: any[];
    get flat: TypedArray;
    set flat(flat: TypedArray);
    fill(value: (() => number) | number): Tensor;
    coordinates(index: number): number[];
    index(...coordinates: number[]): number;
    get(...coordinates: number[]): number;
    set(value: number, ...coordinates: number[]): Tensor;
    copy(tensor: Tensor, instaniate?: boolean): Tensor;
    transpose(...axes: number[]): Tensor;
}
```

### Licence
_____
This code is released under the MIT license.
