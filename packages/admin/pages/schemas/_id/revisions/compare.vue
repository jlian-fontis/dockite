<!-- eslint-disable vue/no-v-html -->
<template>
  <fragment>
    <portal to="header">
      <el-row style="width: 100%" type="flex" justify="space-between" align="middle">
        <h2>
          Comparing <strong>{{ $route.query.from }}</strong> against
          <strong>{{ $route.query.to }}</strong>
        </h2>
      </el-row>
    </portal>

    <div v-loading="loading > 0" class="schema-revision-compare-page el-loading-parent__min-height">
      <div
        v-if="primaryRevision && secondaryRevision"
        class="flex w-full py-5 rounded-t"
        style="background: #f8fafd; border: 1px solid #ddd; border-bottom: 0;"
      >
        <div
          v-for="revision in [primaryRevision, secondaryRevision]"
          :key="revision.id"
          class="flex-1 px-3 -my-1"
        >
          <ul>
            <li class="py-1">
              <strong>Revision ID:</strong>
              {{ revision.id }}
            </li>

            <li class="py-1">
              <strong>Created At:</strong>
              {{ revision.createdAt | toLocaleDateString }}
            </li>

            <li class="py-1">
              <strong>Created By:</strong>
              {{ revision.user && revision.user.email }}
            </li>
          </ul>
        </div>
      </div>

      <div
        v-if="diffHTML"
        :class="{ 'dockite-diff--highlight': highlight }"
        style="background: #ffffff; margin-bottom: 1rem; margin-top: -0.25rem"
        v-html="diffHTML"
      />

      <el-alert
        v-else
        type="warning"
        title="No changes made between revisions"
        show-icon
        style="margin-bottom: 1rem;"
        :closable="false"
      >
        There are no differences between {{ primary }} and {{ secondary }}.
      </el-alert>

      <el-button
        style="width: auto"
        class="dockite-button--restore"
        type="primary"
        :disabled="loading > 0 || !$can('internal:schema:update')"
        @click="restoreToRevision(primary)"
        @mouseover.native="highlight = true"
        @mouseleave.native="highlight = false"
      >
        Restore to {{ primary.slice(0, 8) }}
      </el-button>
    </div>
  </fragment>
</template>

<script lang="ts">
import { Schema } from '@dockite/database';
import { formatDistanceToNow } from 'date-fns';
import { html } from 'diff2html';
import { Component, Vue, Watch, Ref } from 'nuxt-property-decorator';
import unidiff from 'unidiff';
import { Fragment } from 'vue-fragment';

import { ManyResultSet, AllSchemaRevisionsResultItem } from '~/common/types';
import { stableJSONStringify } from '~/common/utils';
import * as data from '~/store/data';
import * as revision from '~/store/revision';

import 'diff2html/bundles/css/diff2html.min.css';

@Component({
  components: {
    Fragment,
  },
})
export default class SchemaRevisionsPage extends Vue {
  public highlight = false;

  public diffHTML = '';

  public loading = 0;

  @Ref()
  readonly diffDetail!: HTMLTextAreaElement;

  get primary(): string {
    return this.$route.query.from as string;
  }

  get secondary(): string {
    return this.$route.query.to as string;
  }

  get allSchemaRevisions(): ManyResultSet<AllSchemaRevisionsResultItem> {
    const state: data.DataState = this.$store.state[data.namespace];

    return state.allSchemaRevisions;
  }

  get primaryRevision(): AllSchemaRevisionsResultItem | null {
    const revision = this.allSchemaRevisions.results.find(revision => revision.id === this.primary);

    return revision ?? null;
  }

  get primaryRevisionData(): string {
    if (this.primaryRevision && this.primaryRevision.data) {
      return stableJSONStringify(this.primaryRevision.data);
    }

    return '';
  }

  get secondaryRevision(): AllSchemaRevisionsResultItem | null {
    const revision = this.allSchemaRevisions.results.find(
      revision => revision.id === this.secondary,
    );

    return revision ?? null;
  }

  get secondaryRevisionData(): string {
    if (this.secondaryRevision && this.secondaryRevision.data) {
      return stableJSONStringify(this.secondaryRevision.data);
    }

    return '';
  }

  get canCompare(): boolean {
    return this.primary !== null && this.secondary !== null && this.primary !== this.secondary;
  }

  get schema(): Schema {
    return this.$store.getters[`${data.namespace}/getSchemaWithFieldsById`](this.schemaId);
  }

  get schemaId(): string {
    return this.$route.params.id;
  }

  get currentPage(): number {
    if (!this.allSchemaRevisions.currentPage) {
      return 1;
    }

    return this.allSchemaRevisions.currentPage;
  }

  get totalPages(): number {
    if (!this.allSchemaRevisions.totalPages) {
      return 1;
    }

    return this.allSchemaRevisions.totalPages;
  }

  get totalItems(): number {
    if (!this.allSchemaRevisions.totalItems) {
      return 1;
    }

    return this.allSchemaRevisions.totalItems;
  }

  public async fetchAllSchemaRevisions(): Promise<void> {
    this.loading += 1;

    await this.$store.dispatch(`${data.namespace}/fetchAllSchemaRevisionsForSchema`, {
      schemaId: this.schemaId,
    });

    this.$nextTick(() => {
      this.loading -= 1;
    });
  }

  public async fetchSchemaById(force = false): Promise<void> {
    try {
      this.loading += 1;

      await this.$store.dispatch(`${data.namespace}/fetchSchemaWithFieldsById`, {
        id: this.$route.params.id,
        force,
      });
    } catch (_) {
      this.$message({
        message: 'Unable to fetch schema.',
        type: 'error',
      });
    } finally {
      this.$nextTick(() => {
        this.loading -= 1;
      });
    }
  }

  public async restoreToRevision(revisionId: string): Promise<void> {
    try {
      this.loading += 1;

      await this.$store.dispatch(`${revision.namespace}/restoreSchemaRevision`, {
        revisionId,
        schemaId: this.schemaId,
      });

      this.$message({
        message: 'Revision restored successfully',
        type: 'success',
      });

      this.$router.replace(`/schemas/${this.schemaId}`);
    } catch (err) {
      this.$message({
        message: 'Revision was unable to be restored',
        type: 'error',
      });
    } finally {
      this.$nextTick(() => {
        this.loading -= 1;
      });
    }
  }

  public cellValueFromNow(_row: never, _column: never, cellValue: string, _index: never): string {
    return formatDistanceToNow(new Date(cellValue)) + ' ago';
  }

  @Watch('schemaId', { immediate: true })
  handleSchemaIdChange(): void {
    this.fetchSchemaById();
    this.fetchAllSchemaRevisions();
  }

  @Watch('allSchemaRevisions', { immediate: true })
  handleSchemaRevisionsChange(): void {
    if (this.allSchemaRevisions.results.length > 0) {
      const diff = unidiff.formatLines(
        unidiff.diffLines(this.primaryRevisionData, this.secondaryRevisionData),
        {
          context: Infinity,
          aname: this.primary,
          bname: this.secondary,
        },
      );

      if (diff) {
        this.diffHTML = html(diff, {
          drawFileList: false,
          outputFormat: 'side-by-side',
          renderNothingWhenEmpty: true,
        });
      }
    }
  }
}
</script>

<style lang="scss">
.all-schema-schemas-page {
  background: #ffffff;
}

.dockite-element--pagination {
  padding: 1rem;
}

.dockite-dialog--revision-detail {
  width: 80%;
  max-width: 1000px;
}

.dockite-diff--highlight {
  .d2h-file-side-diff:first-of-type {
    background: #ffffed;
  }
}

.d2h-file-header {
  display: none;
}

.d2h-file-wrapper {
  border-top: 0;
  border-radius: 0;
}
</style>
