import React, { useMemo, useState } from 'react';
import { Image, Text, View } from "react-native";
import styles from "../styles/ProposalVoteRequest.styles";
import { TextButton } from "../../../components/buttons";
import { MainButton } from "../../../components/mainButton";
import { useDispatch, useSelector } from "react-redux";
import { showActionModal } from "../../../redux/actions/uiAction";
import { ButtonTypes } from "../../../components/actionModal/container/actionModalContainer";
import { useProposalVotedQuery, useProposalVoteMutation } from '../../../providers/queries';
import { updateProposalVoteMeta } from '../../../redux/actions/cacheActions';

const ECENCY_PROPOSAL_ID = 283;
const RE_REQUEST_INTERVAL = 259200000; //3 days;

export const ProposalVoteRequest = () => {

    const dispatch = useDispatch();

    const proposalVotedQuery = useProposalVotedQuery(ECENCY_PROPOSAL_ID);
    const proposalVoteMutation = useProposalVoteMutation();

    const currentAccount = useSelector(state => state.account.currentAccount);

    //assess if user should be promopted to vote proposal
    //makes sure this logic is only calculated once on launch
    const [skipOnLaunch] = useState(!currentAccount ||
        proposalVotedQuery.data ||
        proposalVotedQuery.meta?.processed);


    //render or no render based on dimiss action performed 
    const skipRender = useMemo(() => {
        if (!skipOnLaunch && proposalVotedQuery.meta) {
            const curTime = new Date().getTime();
            const nextRequestTime = proposalVotedQuery.meta.dismissedAt + RE_REQUEST_INTERVAL
            return nextRequestTime > curTime;
        }
        return skipOnLaunch;
    }, [proposalVotedQuery.meta])


    if (skipRender) {
        return null;
    }

    const voteCasted = proposalVoteMutation.isSuccess;

    const _voteAction = () => {
        proposalVoteMutation.mutate({ proposalId: ECENCY_PROPOSAL_ID })
    }


    const _remindLater = () => {
        dispatch(showActionModal({
            title: "Dismiss Vote Request",
            buttons: [
                {
                    text: "Forever",
                    type: ButtonTypes.CANCEL,
                    onPress: () => {
                        console.log('Ignore');
                        dispatch(updateProposalVoteMeta(
                            ECENCY_PROPOSAL_ID,
                            currentAccount.username,
                            true,
                            new Date().getTime()
                        ))
                    },
                },
                {
                    text: "Remind Later",
                    onPress: () => {
                        dispatch(updateProposalVoteMeta(
                            ECENCY_PROPOSAL_ID,
                            currentAccount.username,
                            false,
                            new Date().getTime()
                        ))
                    },
                },
            ],
        }))
    };


    const _actionPanel = () => {
        return (
            <View style={styles.actionPanel}>
                <MainButton
                    onPress={_voteAction}
                    style={{ height: 40 }}
                    textStyle={styles.voteBtnTitle}
                    text={"Cast My Vote"}
                    isLoading={proposalVoteMutation.isLoading}

                />
                <TextButton
                    onPress={_remindLater}
                    style={{ marginLeft: 8 }}
                    text={"Dismiss"}
                />
            </View>
        );
    }

    const title = voteCasted ? "We are grateful!" : "Enjoying Ecency!";
    const body = voteCasted ? "Your support means everything to us" : "Support proposal by voting, be part of our continuous efforts to improve experience on Ecency."

    return (
        <View style={styles.container}>
            <View style={styles.content} >
                <View style={{ flex: 1 }}>
                    <Text style={styles.title} >
                        {title}
                    </Text>

                    <Text style={styles.description} >
                        {body}
                    </Text>
                </View>

                <Image
                    resizeMode="contain"
                    style={{ width: 56, marginHorizontal: 12 }}
                    source={require('../../../assets/ecency_logo_transparent.png')}
                />

            </View>
            {!voteCasted && _actionPanel()}
        </View>
    )
};