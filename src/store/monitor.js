import axios from 'axios';
import Goal from '../classes/Goal';
import GoalsCollection from '../classes/GoalsCollection';
import GoalsCollectionList from '../classes/GoalsCollectionList';
// import Comment from '../classes/Comment';

export default {
  namespaced: true,
  state: {
    goalsCollectionArray: [],
    goalsCollectionList: new GoalsCollectionList(),
  },
  getters: {
    isGoalsCollectionEmpty: (state) => {
      if (state.goalsCollectionList.isEmpty()) {
        return true;
      }
      return false;
    },
    getGoalsCollectionList: (state) => state.goalsCollectionList,
    getUserGoalsCollectionArray: (state) => state.goalsCollectionArray,
  },
  mutations: {
    REFRESH_PUSHS(state, goal) {
      state.goalsCollectionArray.forEach((collection) => {
        if (collection.isGoalPresent(goal)) {
          collection.update(goal);
        }
      });
    },
    SET_GOALS_COLLECTION(state, goalsCollectionList) {
      state.goalsCollectionList = goalsCollectionList;
    },
    SET_COLLECTION(state, collection) {
      state.goalsCollectionArray = collection;
    },
    CLEAR_COLLECTION(state) {
      state.goalsCollectionArray = [];
    },
  },
  actions: {
    // async comments({ _ }, { userId, goalId }) {
    //   return new Promise((resolve, reject) => {
    //     axios.get(`users/${userId}/monitor/goals/${goalId}/comments`)
    //       .then((response) => {
    //         console.log('REFACTOR', _);
    //         const comments = [];
    //         response.data.forEach((comment) => {
    //           console.log('Was ist hier los?', comment);
    //           comments.push(new Comment(
    //             {
    //               content: comment.content,
    //               commentingUser: comment.commenting_user.name,
    //               goalId: comment.goal_id,
    //               postedAt: comment.posted_at,
    //             },
    //           ));
    //           resolve(comments);
    //         });
    //       })
    //       .catch((error) => {
    //         reject(error);
    //       });
    //   });
    // },
    async push({ commit }, { userId, goalId }) {
      commit('states/TOGGLE_LOADING', null, { root: true });
      // commit({ type: 'states/TOGGLE_LOADING' }, { options: { root: true } });
      await axios.post(`users/${userId}/push/${goalId}`)
        .then((response) => {
          const goal = Goal.createGoalFromData(response.data);
          commit('REFRESH_PUSHS', goal);
        })
        .catch((e) => {
          console.log(e);
        })
        .finally(() => {
          commit('states/TOGGLE_LOADING', null, { root: true });
        });
    },
    /* Get collection of goals by weekName (weekName = GoalCollection->name) */
    async initOverview({ commit }, userId) {
      await axios.get(`users/${userId}/monitor/goals`)
        .then((response) => {
          commit('CLEAR_COLLECTION');
          // response.data.collection
          const responseCollection = response.data.collection;
          const goalCollectionList = new GoalsCollectionList();
          const collection = responseCollection.map((c) => {
            const goals = c.goals.map((g) => Goal.createGoalFromData(g));
            const goalsCollection = new GoalsCollection(
              c.collectionName,
              c.date,
              goals,
            );

            goalCollectionList.addGoalCollection(goalsCollection);

            return goalsCollection;
          });
          console.log('IST EMPTY?', goalCollectionList.isEmpty());
          commit('SET_GOALS_COLLECTION', goalCollectionList);
          commit('SET_COLLECTION', collection);
        })
        .catch((e) => {
          console.error(e);
        });
    },
  },
};
