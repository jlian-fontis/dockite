import { ActionTree, GetterTree, MutationTree } from 'vuex';

import { RootState } from '.';

import {
  CreateUserMutationResponse,
  DeleteUserMutationResponse,
  UpdateUserMutationResponse,
} from '~/common/types';
import CreateUserMutation from '~/graphql/mutations/create-user.gql';
import DeleteUserMutation from '~/graphql/mutations/delete-user.gql';
import UpdateUserMutation from '~/graphql/mutations/update-user.gql';
import * as data from '~/store/data';

export interface UserState {
  errors: null | string | string[];
}

export interface CreateUserPayload {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  roles: string[];
  scopes: string[];
}

export interface UpdateUserPayload extends CreateUserPayload {
  id: string;
}

export interface DeleteUserPayload {
  userId: string;
}

export const namespace = 'user';

export const state = (): UserState => ({
  errors: null,
});

export const getters: GetterTree<UserState, RootState> = {};

export const actions: ActionTree<UserState, RootState> = {
  async createUser(_, payload: CreateUserPayload): Promise<void> {
    const { data: createData } = await this.$apolloClient.mutate<CreateUserMutationResponse>({
      mutation: CreateUserMutation,
      variables: {
        email: payload.email,
        firstName: payload.firstName,
        lastName: payload.lastName,
        password: payload.password,
        roles: payload.roles,
        scopes: payload.scopes,
      },
      update: () => {
        this.$apolloClient.resetStore();
        this.commit(`${data.namespace}/clearUserData`);
      },
    });

    if (!createData?.createUser) {
      throw new Error('Unable to create user');
    }
  },

  async updateUser(_, payload: UpdateUserPayload): Promise<void> {
    const { data: userData } = await this.$apolloClient.mutate<UpdateUserMutationResponse>({
      mutation: UpdateUserMutation,
      variables: {
        email: payload.email,
        firstName: payload.firstName,
        lastName: payload.lastName,
        password: payload.password,
        roles: payload.roles,
        scopes: payload.scopes,
      },
      update: () => {
        this.commit(`${data.namespace}/clearUserData`, payload.id);
      },
    });

    if (!userData?.updateUser) {
      throw new Error('Unable to update user');
    }
  },

  async deleteUser(_, payload: DeleteUserPayload): Promise<void> {
    const { data: deleteData } = await this.$apolloClient.mutate<DeleteUserMutationResponse>({
      mutation: DeleteUserMutation,
      variables: {
        id: payload.userId,
      },
      update: () => {
        this.$apolloClient.resetStore();
        this.commit(`${data.namespace}/clearUserData`, payload.userId);
      },
    });

    if (!deleteData?.removeUser) {
      throw new Error('Unable to delete user');
    }
  },
};

export const mutations: MutationTree<UserState> = {
  setErrors(state, payload: string | string[]) {
    state.errors = payload;
  },

  clearErrors(state) {
    state.errors = null;
  },
};