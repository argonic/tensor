import { expect } from "chai";
import Tensor from "../src/tensor";

describe("Tensor", () => {
    it("accepts scalar tensors", () => {
        const tensor = new Tensor(Uint8Array, 1);
        tensor.fill(1);
        expect(tensor.get(0)).to.equal(1);
        expect(tensor.flat).to.deep.equal(new Uint8Array(1).fill(1));
        expect(tensor.dimensions).to.equal(1);
        expect(tensor.length).to.equal(1);
        expect(tensor.shape).to.deep.equal([1]);
    });
    it("uses zero as default fill", () => {
        const tensor = new Tensor(Uint8Array, 2);
        expect(tensor.get(0)).to.equal(0);
        expect(tensor.flat).to.deep.equal(new Uint8Array(2).fill(0));
    });
    it("accepts value fill", () => {
        const tensor = new Tensor(Uint8Array, 2);
        tensor.fill(1);
        expect(tensor.get(0)).to.equal(1);
        expect(tensor.flat).to.deep.equal(new Uint8Array(2).fill(1));
    });
    it("accepts function fill", () => {
        const tensor = new Tensor(Uint8Array, 2);
        tensor.fill(() => 1);
        expect(tensor.get(0)).to.equal(1);
        expect(tensor.flat).to.deep.equal(new Uint8Array(2).fill(1));
    });
    it("creates one million dimensions tensor", function() {
        this.slow(5000);
        // @ts-ignore
        const tensor = new Tensor(Uint8Array, Array(1000000).fill(1));
        expect(tensor.dimensions).to.equal(1000000);
    });
    it("can copy from another TypedArray", () => {
        // @ts-ignore
        const tensor = new Tensor(Uint8Array, 10);
        tensor.flat = new Uint8Array(10).fill(1);
        expect(true).to.equal(true);
    });
    it("have length as the product of all shape depths", () => {
        const shapes = [
            [1, 20, 30],
            [25, 24, 1],
            [1, 1, 1, 1],
            [25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25],
            [1],
        ];
        for (const shape of shapes) {
            const object = new Tensor(Uint8Array, ...shape);
            expect(object.length).to.equal(shape.reduce((a, b) => a * b));
        }
    });
    it("have dimensions as the shape length", () => {
        const shapes = [
            [1, 20, 30],
            [25, 24, 1],
            [1, 1, 1, 1],
            [25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25],
            [1],
        ];
        for (const shape of shapes) {
            const object = new Tensor(Uint8Array, ...shape);
            expect(object.dimensions).to.equal(shape.length);
        }
    });
    it("have shape as the supplied shape", () => {
        const shapes = [
            [1, 20, 30],
            [25, 24, 1],
            [1, 1, 1, 1],
            [25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25],
            [1],
        ];
        for (const shape of shapes) {
            const object = new Tensor(Uint8Array, ...shape);
            expect(object.shape).to.deep.equal(shape);
        }
    });
    it("can get values by indices and by coordinates", () => {
        const tensor = new Tensor(Uint8Array, 5, 4, 3);
        let i = 1;
        tensor.fill(() => i++);
        let j = 1;
        for (let x = 0; x < 5; x++) {
            for (let y = 0; y < 4; y++) {
                for (let z = 0; z < 3; z++) {
                    const index = tensor.index(x, y, z);
                    const coordinates = tensor.coordinates(index);
                    expect([x, y, z]).to.deep.equal(coordinates);
                    expect(tensor.get(index)).to.equal(j);
                    expect(tensor.get(...coordinates)).to.equal(j);
                    expect(tensor.set(j, ...coordinates).get(...coordinates)).to.equal(j);
                    expect(tensor.set(j, index).get(index)).to.equal(j);
                    j++;
                }
            }
        }
    });
    it("creates typed tensor as Uint8Array", () => {
        const tensor = new Tensor(Uint8Array, 5, 4, 3);
        expect(tensor.flat.constructor).to.deep.equal(Uint8Array);
    });
    it("creates typed tensor as Uint16Array", () => {
        const tensor = new Tensor(Uint16Array, 5, 4, 3);
        expect(tensor.flat.constructor).to.deep.equal(Uint16Array);
    });
    it("creates typed tensor as Uint32Array", () => {
        const tensor = new Tensor(Uint32Array, 5, 4, 3);
        expect(tensor.flat.constructor).to.deep.equal(Uint32Array);
    });
    it("creates typed tensor as Int8Array", () => {
        const tensor = new Tensor(Int8Array, 5, 4, 3);
        expect(tensor.flat.constructor).to.deep.equal(Int8Array);
    });
    it("creates typed tensor as Int16Array", () => {
        const tensor = new Tensor(Int16Array, 5, 4, 3);
        expect(tensor.flat.constructor).to.deep.equal(Int16Array);
    });
    it("creates typed tensor as Int32Array", () => {
        const tensor = new Tensor(Int32Array, 5, 4, 3);
        expect(tensor.flat.constructor).to.deep.equal(Int32Array);
    });
    it("creates typed tensor as Float32Array", () => {
        const tensor = new Tensor(Float32Array, 5, 4, 3);
        expect(tensor.flat.constructor).to.deep.equal(Float32Array);
    });
    it("creates typed tensor as Float64Array", () => {
        const tensor = new Tensor(Float64Array, 5, 4, 3);
        expect(tensor.flat.constructor).to.deep.equal(Float64Array);
    });
    it("returns correct strides", () => {
        const shapesAndStrides = [
            [[1, 20, 30], [600, 30, 1]],
            [[25, 24, 1], [24, 1, 1]],
            [[1, 1, 1, 1], [1, 1, 1, 1]],
        ];
        for (const shapeAndStrides of shapesAndStrides) {
            const [shape, strides] = shapeAndStrides;
            const object = new Tensor(Uint8Array, ...shape);
            expect(object.strides).to.deep.equal(strides);
        }
    });
    it("equals to a transpose of a transpose", () => {
        const tensor = new Tensor(Uint8Array, 5, 4, 3);
        let i = 1;
        tensor.fill(() => i++);
        expect(tensor.T.T.array).to.deep.equal(tensor.array);
        expect(tensor.T.T.max).to.deep.equal(tensor.max);
        expect(tensor.T.T.min).to.deep.equal(tensor.min);
    });
    it("not equals to its transpose", () => {
        const tensor = new Tensor(Uint8Array, 5, 4, 3);
        let i = 1;
        tensor.fill(() => i++);
        expect(tensor.T.max).to.deep.equal(tensor.max);
        expect(tensor.T.min).to.deep.equal(tensor.min);
        expect(tensor.T.array).to.not.deep.equal(tensor.array);
    });
    it("prints correct max value", () => {
        const tensor = new Tensor(Uint8Array, 5, 4, 3);
        let i = 1;
        tensor.fill(() => i++);
        expect(tensor.max).to.deep.equal(tensor.length);
    });
    it("prints correct max value", () => {
        const tensor = new Tensor(Uint8Array, 5, 4, 3);
        let i = 1;
        tensor.fill(() => i++);
        expect(tensor.min).to.deep.equal(1);
    });
    it("can copy a tensor without constructing a new tensor", () => {
        const tensor1 = new Tensor(Uint8Array, 5, 4, 3);
        const tensor2 = new Tensor(Uint8Array, 6, 10);
        tensor2.fill(() => 0);
        expect(tensor1.copy(tensor2)).to.equal(tensor1);
        expect(tensor1.copy(tensor2).array).to.deep.equal(tensor2.array);
    });
    it("can copy a tensor and construct a new tensor", () => {
        const tensor1 = new Tensor(Uint8Array, 5, 4, 3);
        const tensor2 = new Tensor(Uint8Array, 6, 10);
        expect(tensor1.copy(tensor2, true)).to.not.equal(tensor1);
        expect(tensor1.copy(tensor2, true).array).to.deep.equal(tensor2.array);
    });
    describe("Checks", () => {
        it("rejects zero dimensions tensors", () => {
            expect(() => {
                const tensor = new Tensor(Uint8Array);
            }).to.throw();
        });
        it("rejects zero dimension depths", () => {
            expect(() => {
                const tensor = new Tensor(Uint8Array, 0);
            }).to.throw();
        });
        it("rejects negative dimension depths", () => {
            expect(() => {
                const tensor = new Tensor(Uint8Array, -1);
            }).to.throw();
        });
        it("rejects float dimension depths", () => {
            expect(() => {
                const tensor = new Tensor(Uint8Array, 1.05);
            }).to.throw();
        });
        it("rejects getting index with fewer or more coordinates than expected", () => {
            expect(() => {
                const tensor = new Tensor(Uint8Array, 1, 2, 3);
                tensor.index(1, 2);
            }).to.throw();
            expect(() => {
                const tensor = new Tensor(Uint8Array, 1, 2, 3);
                tensor.index(1, 2, 3, 4);
            }).to.throw();
        });
        it("rejects copying from a different TypedArray", () => {
            expect(() => {
                const tensor = new Tensor(Uint8Array, 10);
                tensor.flat = new Uint16Array(10).fill(1);
            }).to.throw();
        });
        it("rejects copying from a smaller or bigger TypedArray", () => {
            expect(() => {
                const tensor = new Tensor(Uint8Array, 10);
                tensor.flat = new Uint8Array(5).fill(1);
            }).to.throw();
            expect(() => {
                const tensor = new Tensor(Uint8Array, 10);
                tensor.flat = new Uint8Array(15).fill(1);
            }).to.throw();
        });
    });
});
