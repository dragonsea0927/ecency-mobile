import React, { useState } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';

// Services and Actions
import {
  useDraftDeleteMutation,
  useGetDraftsQuery,
  useGetSchedulesQuery,
  useMoveScheduleToDraftsMutation,
  useScheduleDeleteMutation
} from '../../../providers/queries/draftQueries';

// Middleware

// Constants
import { default as ROUTES } from '../../../constants/routeNames';

// Utilities

// Component
import DraftsScreen from '../screen/draftsScreen';


const DraftsContainer = ({ currentAccount, navigation, route }) => {

  const { mutate: deleteDraft, isLoading: isDeletingDraft } = useDraftDeleteMutation()
  const { mutate: deleteSchedule, isLoading: isDeletingSchedule } = useScheduleDeleteMutation();
  const {
    mutate: moveScheduleToDrafts,
    isLoading: isMovingToDrafts
  } = useMoveScheduleToDraftsMutation()

  const {
    isLoading: isLoadingDrafts,
    data: drafts = [],
    isFetching: isFetchingDrafts,
    refetch: refetchDrafts
  } = useGetDraftsQuery();

  const {
    isLoading: isLoadingSchedules,
    data: schedules = [],
    isFetching: isFetchingSchedules,
    refetch: refetchSchedules
  } = useGetSchedulesQuery();


  const [initialTabIndex] = useState(route.params?.showSchedules ? 1 : 0);

  // Component Functions
  const _onRefresh = () => {
    refetchDrafts();
    refetchSchedules();
  }

  const _editDraft = (id:string) => {
    const selectedDraft = drafts.find((draft) => draft._id === id);

    navigation.navigate({
      name: ROUTES.SCREENS.EDITOR,
      key: `editor_draft_${id}`,
      params: {
        draft: selectedDraft,
        fetchPost: refetchDrafts,
      },
    });
  };

  const _isLoading = isLoadingDrafts
    || isLoadingSchedules
    || isFetchingDrafts
    || isFetchingSchedules
    || isDeletingDraft
    || isDeletingSchedule
    || isMovingToDrafts

  return (
    <DraftsScreen
      isLoading={_isLoading}
      editDraft={_editDraft}
      currentAccount={currentAccount}
      drafts={drafts}
      schedules={schedules}
      removeDraft={deleteDraft}
      moveScheduleToDraft={moveScheduleToDrafts}
      removeSchedule={deleteSchedule}
      onRefresh={_onRefresh}
      initialTabIndex={initialTabIndex}
    />
  );
};

const mapStateToProps = (state) => ({
  currentAccount: state.account.currentAccount,
});

export default injectIntl(connect(mapStateToProps)(DraftsContainer));


