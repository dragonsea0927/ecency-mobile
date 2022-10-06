import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useIntl } from 'react-intl';
import { useAppDispatch } from '../../hooks';
import { toastNotification } from '../../redux/actions/uiAction';
import {
    addFragment,
    deleteFragment,
    deleteImage,
    getFragments,
    getImages,
    updateFragment,
} from '../ecency/ecency';
import { MediaItem, Snippet } from '../ecency/ecency.types';
import QUERIES from './queryKeys';

interface SnippetMutationVars {
    id: string | null;
    title: string;
    body: string;
}


/** GET QUERIES **/

export const useMediaQuery = () => {
    const intl = useIntl();
    const dispatch = useAppDispatch();
    return useQuery<MediaItem[]>([QUERIES.MEDIA.GET], getImages, {
        initialData: [],
        onError: () => {
            dispatch(toastNotification(intl.formatMessage({ id: 'alert.fail' })));
        },
    });
};

export const useSnippetsQuery = () => {
    const intl = useIntl();
    const dispatch = useAppDispatch();
    return useQuery<Snippet[]>([QUERIES.SNIPPETS.GET], getFragments, {
        initialData: [],
        onError: () => {
            dispatch(toastNotification(intl.formatMessage({ id: 'alert.fail' })));
        },
    });
};




/** ADD UPDATE MUTATIONS **/

export const useSnippetsMutation = () => {
    const intl = useIntl();
    const dispatch = useAppDispatch();
    const queryClient = useQueryClient();

    return useMutation<Snippet[], undefined, SnippetMutationVars>(
        async (vars) => {
            console.log('going to add/update snippet', vars);
            if (vars.id) {
                const response = await updateFragment(vars.id, vars.title, vars.body);
                return response;
            } else {
                const response = await addFragment(vars.title, vars.body);
                return response;
            }
        },
        {
            onMutate: (vars) => {
                console.log('mutate snippets for add/update', vars);

                const _newItem = {
                    id: vars.id,
                    title: vars.title,
                    body: vars.body,
                    created: new Date().toDateString(),
                    modified: new Date().toDateString(),
                } as Snippet;

                const data = queryClient.getQueryData<Snippet[]>([QUERIES.SNIPPETS.GET]);

                let _newData: Snippet[] = data ? [...data] : [];
                if (vars.id) {
                    const snipIndex = _newData.findIndex((item) => vars.id === item.id);
                    _newData[snipIndex] = _newItem;
                } else {
                    _newData = [_newItem, ..._newData];
                }

                queryClient.setQueryData([QUERIES.SNIPPETS.GET], _newData);
            },
            onSuccess: (data) => {
                console.log('added/updated snippet', data);
                queryClient.invalidateQueries([QUERIES.SNIPPETS.GET]);
            },
            onError: () => {
                dispatch(toastNotification(intl.formatMessage({ id: 'snippets.message_failed' })));
            },
        },
    );
};



/** DELETE MUTATIONS **/

export const useMediaDeleteMutation = () => {
    const queryClient = useQueryClient();
    const dispatch = useAppDispatch();
    const intl = useIntl();
    return useMutation<string[], undefined, string[]>(async (deleteIds) => {
        for (const i in deleteIds) {
            await deleteImage(deleteIds[i]);
        }
        return deleteIds;
    }, {
        retry: 3,
        onSuccess: (deleteIds) => {
            console.log('Success media deletion delete', deleteIds);
            const data: MediaItem[] | undefined = queryClient.getQueryData([QUERIES.MEDIA.GET]);
            if (data) {
                const _newData = data.filter((item)=>(!deleteIds.includes(item._id)))
                queryClient.setQueryData([QUERIES.MEDIA.GET], _newData);
            }
        },
        onError: () => {
            dispatch(toastNotification(intl.formatMessage({ id: 'uploads_modal.delete_failed' })));
            queryClient.invalidateQueries([QUERIES.MEDIA.GET]);
        },
    });
};


export const useSnippetDeleteMutation = () => {
    const queryClient = useQueryClient();
    const dispatch = useAppDispatch();
    const intl = useIntl();
    return useMutation<Snippet[], undefined, string>(deleteFragment, {
        retry: 3,
        onSuccess: (data) => {
            console.log('Success scheduled post delete', data);
            queryClient.setQueryData([QUERIES.SNIPPETS.GET], data);
        },
        onError: () => {
            dispatch(toastNotification(intl.formatMessage({ id: 'alert.fail' })));
        },
    });
};
