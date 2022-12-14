import { ref } from 'vue'
import { defineStore } from 'pinia'
import {
  create,
  createMany,
  getAllByColumn,
  getOneWithId,
  updateManyById,
  updateOne,
} from '@/utils/dbQueries'
import type { IproductWithSpecifications } from '@/types'
import type {
  IproductC,
  IproductR,
  IproductSpecificationC,
  IproductSpecificationR,
  IproductSpecificationU,
  IproductU,
} from '@/types/tables'

export const useProductsStore = defineStore('products', {
  state: () => {
    const products = ref<IproductWithSpecifications[]>([])
    const searchProducts = ref('')
    const loader = ref<'loading' | 'success' | 'empty'>('loading')

    const createProduct = async (params: IproductC) => {
      const { data } = await create<IproductC, IproductR>('products', params)
      return { data }
    }

    const createSpecifications = async (params: IproductSpecificationC[]) => {
      const { data } = await createMany<
        IproductSpecificationC[],
        IproductSpecificationR[]
      >('specifications', params)
      if (data) {
        console.log(data)
      }
    }

    const setProducts = async (
      categoryId: number,
      search?: string,
      order?: string
    ) => {
      loader.value = 'loading'
      products.value = []
      const newProducts = ref<IproductWithSpecifications[]>([])
      const { data } = await getAllByColumn<IproductR>(
        'products',
        'categoryId',
        categoryId,
        '*, manufacturerId(id, title)',
        order ?? 'id',
        search
      )
      if (data?.length) {
        for (const product of data) {
          const { data: specifications } =
            await getAllByColumn<IproductSpecificationR>(
              'specifications',
              'productId',
              product.id,
              'id, value,  categorySpecificationsId(id, title, units, visible)',
              'categorySpecificationsId'
            )

          if (specifications) {
            const newProduct: IproductWithSpecifications = {
              ...product,
              specifications,
            }
            newProducts.value.push(newProduct)
          }
        }
      } else loader.value = 'empty'
      products.value = newProducts.value
      loader.value = 'success'
    }

    const getProduct = async (
      productId: number,
      selectSpecifications?: string
    ) => {
      const product = ref<IproductWithSpecifications | null>(null)

      const { data } = await getOneWithId<IproductR>(
        'products',
        productId,
        '*, manufacturerId(id, title)'
      )

      const selectValue =
        selectSpecifications ??
        'id, value,  categorySpecificationsId(id, title, units)'
      if (data) {
        const { data: specifications } =
          await getAllByColumn<IproductSpecificationR>(
            'specifications',
            'productId',
            productId,
            selectValue
          )
        if (specifications) {
          product.value = { ...data, specifications }
        }
      }
      return product
    }

    const updateProduct = async (id: number, params: IproductU) => {
      const { data } = await updateOne<IproductU, IproductR>(
        'products',
        id,
        params
      )
      if (data) {
        const product = await getProduct(data.id)
        products.value = products.value.map((prod) =>
          prod.id === data.id ? product.value ?? prod : prod
        )
      }
      return { data }
    }

    const updateProductSpecifications = async (
      specifications: IproductSpecificationU[]
    ) => {
      const { data } = await updateManyById<
        IproductSpecificationU[],
        IproductSpecificationR[]
      >('specifications', specifications)
      return { data }
    }

    return {
      products,
      createProduct,
      createSpecifications,
      setProducts,
      getProduct,
      updateProduct,
      updateProductSpecifications,
      searchProducts,
      loader,
    }
  },
})
