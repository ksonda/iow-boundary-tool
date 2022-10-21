import api from './api';
import TAGS, {
    getListTagProvider,
    getNewItemTagInvalidator,
    getSingleItemProvider,
    getUpdateItemTagInvalidator,
} from './tags';

const boundaryApi = api.injectEndpoints({
    endpoints: build => ({
        getBoundaries: build.query({
            query: ({ utilities }) => ({
                url: '/boundaries/',
                method: 'GET',
                params: { utilities },
            }),
            providesTags: getListTagProvider(TAGS.BOUNDARY),
        }),

        getBoundaryDetails: build.query({
            query: id => ({
                url: `/boundaries/${id}/`,
                method: 'GET',
            }),
            providesTags: getSingleItemProvider(TAGS.BOUNDARY),
            transformResponse: (response, meta, id) => ({ ...response, id }),
        }),

        startNewBoundary: build.mutation({
            query: newBoundary => ({
                url: '/boundaries/',
                method: 'POST',
                data: newBoundary,
            }),
            invalidatesTags: getNewItemTagInvalidator(TAGS.BOUNDARY),
        }),

        updateBoundaryShape: build.mutation({
            query: ({ id, shape }) => ({
                url: `/boundaries/${id}/shape/`,
                method: 'PUT',
                data: shape,
            }),
        }),

        submitBoundary: build.mutation({
            query: ({ id, payload }) => ({
                url: `/boundaries/${id}/submit/`,
                method: 'PATCH',
                data: payload,
            }),
            invalidatesTags: getUpdateItemTagInvalidator(TAGS.BOUNDARY),
        }),
    }),
});

export const {
    useGetBoundariesQuery,
    useGetBoundaryDetailsQuery,
    useStartNewBoundaryMutation,
    useUpdateBoundaryShapeMutation,
    useSubmitBoundaryMutation,
} = boundaryApi;
