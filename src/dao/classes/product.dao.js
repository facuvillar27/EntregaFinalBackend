import productsModel from "../models/products.model.js";
import dotenv from 'dotenv';

dotenv.config();
const PORT = process.env.PORT || 8080;

class ProductsDao {

    async getAll () {
        try {
            const products = await productsModel.find().lean()
            return products
        }catch (error) {
            console.error('Error getting products:', error)
        }
    }

    async getProducts(req) {
        try {
            const result = await this.getFilteredProducts(req)
            const response = this.prepareResponse(req, result)
            return response
        } catch (error) {
            console.error('Error getting products:', error)
        }
    }

    async getById(id) {
        try {
            const product = await productsModel.findById(id)
            return product
        } catch (error) {
            console.error('Error getting product by id:', error)
        }
    }

    async createProduct(product) {
        try {
            const newProduct = await productsModel.create(product)
            return newProduct
        } catch (error) {
            console.error('Error creating product:', error)
        }
    }


    async modifyProduct(id, product) {
        try {
            const updatedProduct = await productsModel.findByIdAndUpdate
                (id, product, { new: true })
            return updatedProduct
        } catch (error) {
            console.error('Error updating product:', error)
        }
    }

    async deleteProduct(id) {
        try {
            const result = await productsModel.findByIdAndDelete(id)
            return result
        } catch (error) {
            console.error('Error deleting product:', error)
        }
    }

    async buildFilter(query) {
        try {
            let filter = {};
            for (let key in query) {
                if (['code', 'status', 'price', 'stock', 'description', 'title'].includes(key)) {
                    filter[key] = query[key];
                }
            }
            return filter;
        } catch (error) {
            console.error('Error building filter:', error)
        }
    }

    buildSortOptions(sort) {
        let sortOptions = {};
        if (sort.toLowerCase() === 'asc') {
            sortOptions = { price: 1 };
        } else if (sort.toLowerCase() === 'desc') {
            sortOptions = { price: -1 };
        }
        return sortOptions;
    }

    buildOptions(page, limit, sortOptions) {
        return {
            page: page,
            limit: limit,
            sort: sortOptions,
            populate: ''
        };
    }

    prepareResponse(req, result) {
        const query = req.query || {};
        const limit = parseInt(query.limit) || 10;
        const response = {
            status: 'success',
            payload: result.docs,
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.prevPage ? `localhost:${PORT}/api/products?page=${result.prevPage}&limit=${limit}` : null,
            nextLink: result.nextPage ? `localhost:${PORT}/api/products?page=${result.nextPage}&limit=${limit}` : null,
        };
        return response;
    }

    async getFilteredProducts(req) {
        const query = req || {};
        const limit = parseInt(query.limit) || 10;
        const page = parseInt(query.page) || 1;
        const sort = query.sort || '';
        const stock = parseInt(query.stock) || 0;

        let filter = await this.buildFilter(query);
        let sortOptions = this.buildSortOptions(sort);
        let options = this.buildOptions(page, limit, sortOptions);

        return await productsModel.paginate(filter, options);
    }

    async getByCode(code) {
        try {
            let product = await productsModel.findOne({ code: code }).lean()
            return product
        } catch (error) {
            console.error('Error getting product by code:', error)
        }
    }
}

export default ProductsDao;