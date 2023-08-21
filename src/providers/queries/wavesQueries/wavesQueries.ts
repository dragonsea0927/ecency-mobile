
  import {
    useQueries,
  } from '@tanstack/react-query';
  import { useEffect, useState } from 'react';

  import { unionBy } from 'lodash';
  import { getComments } from '../../hive/dhive';

import { getAccountPosts } from '../../hive/dhive';
import QUERIES from '../queryKeys';
import { delay } from '../../../utils/editor';
  
  
  
  export const useWavesQuery = (host: string) => {
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [activePermlinks, setActivePermlinks] = useState<string[]>([]);
    const [permlinksBucket, setPermlinksBucket] = useState<string[]>([]);


    useEffect(() => {
      _fetchPermlinks()  
    }, [])


    useEffect(() => {
        if(!!permlinksBucket.length){
            activePermlinks.push(permlinksBucket[activePermlinks.length]);
            setActivePermlinks([...activePermlinks]);
        }
    },[permlinksBucket])


    const _fetchPermlinks = async (startPermlink = '', refresh = false) => {
        setIsLoading(true);
        try{
            const query: any = {
                account: host,
                start_author: !!startPermlink ? host : '',
                start_permlink: startPermlink,
                limit: 10,
                observer: '',
                sort: 'posts',
              };
          
              const result = await getAccountPosts(query);
    
              const _fetchedPermlinks =  result.map(post => post.permlink);
              console.log('permlinks fetched', _fetchedPermlinks);
    
              const _permlinksBucket = refresh ? _fetchedPermlinks : [...permlinksBucket, ..._fetchedPermlinks];
              setPermlinksBucket(_permlinksBucket);
              
              if(refresh){
                //precautionary delay of 200ms to let state update before concluding promise,
                //it is effective for waves refresh routine.
                await delay(200)
              } 
        } catch(err){
            console.warn("failed to fetch waves permlinks");
        }

        setIsLoading(false)
    }
  
    const _fetchWaves = async (pagePermlink: string) => {
      console.log('fetching waves from:', host, pagePermlink);
      const response = await getComments(host, pagePermlink);
      response.sort((a, b) => new Date(a.created) > new Date(b.created) ? -1 : 1);
      console.log('new waves fetched', response);
      return response || [];
    };
  
  
    // query initialization
    const wavesQueries = useQueries({
      queries: activePermlinks.map((pagePermlink) => ({
        queryKey: [QUERIES.WAVES.GET, host, pagePermlink],
        queryFn: () => _fetchWaves(pagePermlink),
        initialData: [],
      })),
    });
  
    const _refresh = async () => {
      setIsRefreshing(true);
      setPermlinksBucket([]);
      setActivePermlinks([]);
      await _fetchPermlinks('', true);
      await wavesQueries[0].refetch();
      setIsRefreshing(false);
    };
  
    const _fetchNextPage = () => {
      const lastPage = wavesQueries.lastItem;
  
      if (!lastPage || lastPage.isFetching) {
        return;
      }
  
      const _nextPagePermlink = permlinksBucket[activePermlinks.length];

      //TODO: find a way to proactively refill active permlinks here.

      if (_nextPagePermlink && !activePermlinks.includes(_nextPagePermlink)) {
        activePermlinks.push(_nextPagePermlink);
        setActivePermlinks([...activePermlinks]);
      } else {
        _fetchPermlinks(permlinksBucket.lastItem)
      }
    };
  
    const _dataArrs = wavesQueries.map((query) => query.data);
  
    return {
      data: unionBy(..._dataArrs, 'url'),
      isRefreshing,
      isLoading: isLoading || wavesQueries.lastItem?.isLoading || wavesQueries.lastItem?.isFetching,
      fetchNextPage: _fetchNextPage,
      refresh: _refresh,
    };
  };
  
  
  
  
  // export const useNotificationReadMutation = () => {
  //   const intl = useIntl();
  //   const dispatch = useAppDispatch();
  //   const queryClient = useQueryClient();
  
  //   const currentAccount = useAppSelector((state) => state.account.currentAccount);
  //   const pinCode = useAppSelector((state) => state.application.pin);
  
  //   // id is options, if no id is provided program marks all notifications as read;
  //   const _mutationFn = async (id?: string) => {
  //     try {
  //       const response = await markNotifications(id);
  //       console.log('Ecency notifications marked as Read', response);
  //       if (!id) {
  //         await markHiveNotifications(currentAccount, pinCode);
  //         console.log('Hive notifications marked as Read');
  //       }
  
  //       return response.unread || 0;
  //     } catch (err) {
  //       bugsnapInstance.notify(err);
  //     }
  //   };
  
  //   const _options: UseMutationOptions<number, unknown, string | undefined, void> = {
  //     onMutate: async (notificationId) => {
  //       // TODO: find a way to optimise mutations by avoiding too many loops
  //       console.log('on mutate data', notificationId);
  
  //       // update query data
  //       const queriesData: [QueryKey, any[] | undefined][] = queryClient.getQueriesData([
  //         QUERIES.NOTIFICATIONS.GET,
  //       ]);
  //       console.log('query data', queriesData);
  
  //       queriesData.forEach(([queryKey, data]) => {
  //         if (data) {
  //           console.log('mutating data', queryKey);
  //           const _mutatedData = data.map((item) => ({
  //             ...item,
  //             read: !notificationId || notificationId === item.id ? 1 : item.read,
  //           }));
  //           queryClient.setQueryData(queryKey, _mutatedData);
  //         }
  //       });
  //     },
  
  //     onSuccess: async (unreadCount, notificationId) => {
  //       console.log('on success data', unreadCount);
  
  //       dispatch(updateUnreadActivityCount(unreadCount));
  //       if (!notificationId) {
  //         queryClient.invalidateQueries([QUERIES.NOTIFICATIONS.GET]);
  //       }
  //     },
  //     onError: () => {
  //       dispatch(toastNotification(intl.formatMessage({ id: 'alert.fail' })));
  //     },
  //   };
  
  //   return useMutation(_mutationFn, _options);
  // };
  