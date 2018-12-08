type TypedArray = Uint8Array |
    Uint16Array | Uint32Array | Int8Array |
    Int16Array | Int32Array | Float32Array |
    Float64Array;

type TypedArrayConstructor = Uint8ArrayConstructor |
    Uint16ArrayConstructor | Uint32ArrayConstructor | Int8ArrayConstructor |
    Int16ArrayConstructor | Int32ArrayConstructor | Float32ArrayConstructor |
    Float64ArrayConstructor;

export default class Tensor {
    private tensorType: TypedArrayConstructor;
    // @ts-ignore
    private tensorShape: number[];
    // @ts-ignore
    private tensorLength: number;
    // @ts-ignore
    private tensorFlat: TypedArray;

    private tensorFilled: boolean = false;

    private tensorFill: number = 0;

    private tensorDimensions: number = 0;

    private tensorStrides: number[] = [];

    private tensorMax?: number = undefined;

    private tensorMin?: number = undefined;
    /**
     * Tensor's constructor
     * ______
     * @param shape
     */
    public constructor(type: TypedArrayConstructor, ...shape: any[]) {
        if (shape.length === 1 && Array.isArray(shape[0])) {
            (shape as number[]) = shape[0];
        }
        if (shape.length === 0) {
            throw new Error("Cannot create zero dimensions tensors");
        }
        for (const item of shape) {
            if (typeof item !== "number" || item < 1 || item % 1 !== 0) {
                throw new Error("shape must consist of natural integers");
            }
        }
        this.tensorType = type;
        this.process(shape as number[]);
    }
    /**
     * Tensor's max value
     */
    public get max(): number {
        // @ts-ignore
        return this.tensorMax;
    }
    /**
     * Tensor's min value
     */
    public get min(): number {
        // @ts-ignore
        return this.tensorMin;
    }
    /**
     * Tensor's length
     */
    public get length(): number {
        return this.tensorLength;
    }
    /**
     * Tensor's type
     */
    public get type(): TypedArrayConstructor {
        return this.tensorType;
    }
    /**
     * Tensor's strides
     */
    public get strides(): number[] {
        return this.tensorStrides;
    }
    /**
     * Tensor's dimensions
     */
    public get dimensions(): number {
        return this.tensorDimensions;
    }
    /**
     * Tensor's filling
     */
    public get filling(): number {
        return this.tensorFill;
    }
    /**
     * Tensor's filled
     */
    public get filled(): boolean {
        return this.tensorFilled;
    }
    /**
     * Tensor's shape
     */
    public get shape(): number[] {
        return this.tensorShape;
    }
    /**
     * Tensor's transpose
     * _____
     *
     * Alias of Tensor.transpose()
     */
    public get T(): Tensor {
        return this.transpose();
    }
    /**
     * Tensor's N-Dimensional array
     */
    public get array(): number[] {
        const out: number[] = [];
        const last = (this.tensorDimensions - 1);
        const flat = this.flat;
        for (let index = 0; index < this.tensorLength; index++) {
            const indexes = this.coordinates(index);
            let node: any = out;
            for (let i = 0; i < indexes.length; i++) {
                const pos = indexes[i];
                if (typeof node[pos] !== "object") {
                    node[pos] = []; // create new object
                    if (i === last) { // we are in the last dimension
                        node[pos] = flat[index]; // copy
                        continue;
                    }
                }
                node = node[pos];
            }
        }
        return out;
    }
    /**
     * Tensor's get flat 1D array
     */
    public get flat(): TypedArray {
        if (!this.tensorFilled) {
            this.tensorFlat = this.getTypedArray();
            this.tensorFlat = this.tensorFlat.fill(this.tensorFill);
            this.tensorFilled = true;
        }
        return this.tensorFlat;
    }
    /**
     * Tensor's update flat array
     */
    public set flat(array: TypedArray) {
        if (array.constructor !== this.flat.constructor) {
            throw new Error("copying from a different TypedArray type is forbidden");
        }
        if (array.length !== this.tensorLength) {
            throw new Error("supplied array's length doesn't match with tensor's length");
        }
        this.tensorFlat = array.slice();
        this.tensorMin = array.reduce((a, b) => Math.min(a, b));
        this.tensorMax = array.reduce((a, b) => Math.max(a, b));
    }
    /**
     * Copy Tensor
     * _____
     *
     * This function does copy a tensor to another tensor without instaniating a new tensor
     *
     * @param tensor
     * @return Tensor
     */
    public copy(tensor: Tensor, instaniate: boolean = false): Tensor {
        if (instaniate) {
            return new Tensor(tensor.type, ...tensor.shape).copy(tensor);
        }
        if (tensor.filled) {
            this.tensorFlat = tensor.flat.slice();
        } else {
            // @ts-ignore
            this.tensorFlat = null;
        }
        this.tensorShape = [...tensor.shape];
        this.tensorStrides = [...tensor.strides];
        this.tensorLength = tensor.length;
        this.tensorDimensions = tensor.dimensions;
        this.tensorFill = tensor.filling;
        this.tensorFilled = tensor.filled;
        this.tensorType = tensor.type;
        this.tensorMax = tensor.max;
        this.tensorMin = tensor.min;
        return this;
    }
    /**
     * Tensor's transpose
     * ______
     *
     * It does return a new transpose Tensor
     * if axes is null the function will back reverse all dimensions
     *
     * @param axes
     * @return Tensor
     */
    // @ts-ignore
    public transpose(axes: number[] = null): Tensor {
        if (axes === null) {
            const a = [];
            for (let i = 0; i < this.tensorDimensions; i++) {
                a.push(i);
            }
            axes = a.reverse();
        }
        const newShape: number[] = [];
        for (let i = 0; i < axes.length; i++) {
            newShape[i] = this.tensorShape[axes[i]];
        }
        const tensor = new Tensor(this.tensorType, ...newShape);
        const flat = this.getTypedArray();
        const source = this.flat;
        for (let i = 0; i < this.tensorLength; i++) {
            const invert = this.coordinates(i);
            const ordered = [];
            for (let j = 0; j < invert.length; j++) {
                ordered[axes[j]] = invert[j];
            }
            const index = tensor.index(...ordered);
            flat[index] = source[i];
        }
        tensor.flat = flat;
        return tensor;
    }
    /**
     * Fill the Tensor
     * _____
     *
     * value can be a number or a callable function that returns a number
     * @param value
     */
    public fill(value: (() => number) | number): Tensor {
        if (typeof value === "function") {
            this.tensorFilled = true;
            // @ts-ignore
            this.tensorFill = null;
            this.tensorFlat = this.getTypedArray();
            for (let index = 0; index < this.tensorLength; index++) {
                const v = value();
                this.tensorFlat[index] = v;
                this.tensorMax = typeof this.tensorMax === "undefined" ? v : Math.max(this.tensorMax, v);
                this.tensorMin = typeof this.tensorMin === "undefined" ? v : Math.min(this.tensorMin, v);
            }
        } else {
            this.tensorFilled = false;
            this.tensorFill = value;
            // @ts-ignore
            this.tensorFlat = null;
            this.tensorMin = value;
            this.tensorMax = value;
        }
        return this;
    }
    /**
     * Get an index's coordinates
     * ______
     *
     * @param index
     */
    public coordinates(index: number): number[] {
        const indexes: number[] = [];
        let rest = index;
        for (let i = 0; i < this.tensorShape.length; i++) {
            const div = Math.floor(rest / this.tensorStrides[i]);
            rest -= div * this.tensorStrides[i];
            indexes[i] = div;
        }
        return indexes;
    }
    /**
     * Get coordinates' index
     * ______
     *
     * If only one coordinate is supplied, this function returns the same coordinate
     *
     *
     * @param indexes
     */
    public index(...coordinates: number[]): number {
        if (coordinates.length === 1) {
            return coordinates[0];
        }
        if (coordinates.length !== this.tensorDimensions) {
            throw new Error(
                `expected exactly ${this.tensorDimensions} coordinates, got ${coordinates.length} coordinates instead`);
        }

        let index = 0;
        for (let i = 0; i < coordinates.length; i++) {
            index += coordinates[i] * this.tensorStrides[i];
        }
        return index;
    }
    /**
     * Get coordinates' value
     * _____
     *
     * If only one coordinate is supplied, this function returns index's value instead
     *
     * @param coordinates
     */
    public get(...coordinates: number[]): number {
        return this.flat[this.index(...coordinates)];
    }
    /**
     * Set coordinates' value
     * _____
     *
     * If only one coordinate is supplied, this function sets index's value instead
     *
     * @param coordinates
     */
    public set(value: number, ...coordinates: number[]): Tensor {
        const flat = this.flat;
        const index = this.index(...coordinates);
        const old = flat[index];
        if (old === this.tensorMax && value > old) {
            this.tensorMax = value;
        }
        if (old === this.tensorMin && value < old) {
            this.tensorMin = value;
        }
        flat[index] = value;
        this.tensorFlat = flat;
        return this;
    }
    /**
     * Proccess shape
     * ______
     *
     * It consumes the shape to:
     *
     * - calculate tensor's length: the product of each dimension's depth
     * - calculate tensor's dimensions/rank: the count of dimensions
     * - calculate each dimension's stride
     *
     * Dimension's stride are helpful to calculate coordinates from indices
     *
     * @param shape
     * @return void
     */
    private process(shape: number[]): void {
        this.tensorShape = shape;
        this.tensorLength = shape.reduce((prev: number, current: number) => {
            return prev * current;
        });
        this.tensorDimensions = shape.length;
        this.tensorStrides = [];
        // to calculate strides, start from the end
        for (let i = this.tensorShape.length - 1; i >= 0; i--) {
            let prev = this.tensorStrides[i + 1]; // get next dimension's stride
            const length = i === this.tensorShape.length - 1 ? 1 : this.tensorShape[i + 1]; // next dimension's length
            prev = prev === undefined ? 1 : prev; // default length is 1
            // dimension's stride = (next dimension's stride * next dimension's length)
            this.tensorStrides[i] = length * prev;
        }
    }
    private getTypedArray(): TypedArray {
        return new (this.tensorType)(this.length);
    }
}
