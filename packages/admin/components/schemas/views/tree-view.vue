<template>
  <div v-loading="loading > 0" class="tree-view">
    <el-tree
      v-if="loading === 0 && documentTree.length > 0"
      ref="tree"
      :data="documentTree"
      :default-expand-all="documents.results.length <= 40"
      :render-after-expand="false"
      :expand-on-click-node="false"
      empty-text="There's currently no documents"
      node-key="id"
      draggable
      @node-drop="handleNodeDrop"
    >
      <div slot-scope="{ node, data }" class="dockite-tree--node">
        <span class="dockite-tree--node-label">{{ node.label }}</span>
        <span>
          <el-tag size="mini" style="margin-right: 0.25rem">id:{{ data.id }}</el-tag>

          <router-link :to="`/documents/${data.id}`">
            Edit
          </router-link>
        </span>
      </div>
    </el-tree>

    <el-row type="flex" justify="space-between" align="middle" style="padding: 1rem 0;">
      <span />
      <el-button type="primary" @click="handleSaveTree">
        Save Tree
      </el-button>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Schema } from '@dockite/database';
import { Tree } from 'element-ui';
import { TreeData, TreeNode } from 'element-ui/types/tree';
import { cloneDeep, sortBy, chunk } from 'lodash';
import { Component, Vue, Watch, Ref } from 'nuxt-property-decorator';
import { Fragment } from 'vue-fragment';

import { ManyResultSet, FindDocumentResultItem } from '../../../common/types';

import * as data from '~/store/data';
import * as document from '~/store/document';

interface DocumentTreeData extends TreeData {
  __document: FindDocumentResultItem;
  children?: DocumentTreeData[];
}

@Component({
  components: {
    Fragment,
  },
})
export default class TreeViewComponent extends Vue {
  public documentTree: DocumentTreeData[] = [];

  public loading = 1;

  @Ref()
  public tree!: Tree<any, TreeData>;

  get documents(): ManyResultSet<FindDocumentResultItem> {
    const state: data.DataState = this.$store.state[data.namespace];

    return state.findDocumentsBySchemaId;
  }

  get schemaId(): string {
    return this.$route.params.id;
  }

  get schemaName(): string {
    return this.$store.getters[`${data.namespace}/getSchemaNameById`](this.schemaId);
  }

  get schema(): Schema {
    return this.$store.getters[`${data.namespace}/getSchemaWithFieldsById`](this.schemaId);
  }

  get totalItems(): number {
    if (this.documents.totalItems) {
      return this.documents.totalItems;
    }

    return 0;
  }

  public async fetchFindDocumentsBySchemaId(page = 1): Promise<void> {
    try {
      this.loading += 1;

      await this.$store.dispatch(`${data.namespace}/fetchFindDocumentsBySchemaId`, {
        schemaId: this.schemaId,
        page,
        perPage: 1000,
      });
    } catch (_) {
      this.$message({
        message: 'Failed to retrieve documents, please try again later.',
        type: 'error',
      });
    } finally {
      this.$nextTick(() => {
        this.loading -= 1;
      });
    }
  }

  public makeDocumentTree(parentId: string | null = null): DocumentTreeData[] {
    this.loading += 1;
    const settings = this.schema.settings;

    if (settings.treeViewField && settings.treeViewLabelField) {
      const tree = sortBy(
        this.documents.results.filter(doc => {
          const referenceId = doc.data[settings.treeViewField!]?.id ?? null;

          return referenceId === parentId;
        }),
        doc => {
          if (settings.treeViewSortField) {
            return doc.data[settings.treeViewSortField!] ?? null;
          }

          return doc.id;
        },
      ).map(doc => {
        return {
          id: doc.id,
          __document: cloneDeep(doc),
          label: doc.data[settings.treeViewLabelField!],
          children: this.makeDocumentTree(doc.id),
        };
      });

      setImmediate(() => {
        this.loading -= 1;
      });

      return tree;
    }

    return [];
  }

  public flattenDocumentTree(tree: DocumentTreeData[]): FindDocumentResultItem[] {
    const items: FindDocumentResultItem[] = [];

    tree.forEach(node => {
      items.push(node.__document);

      if (node.children && node.children.length > 0) {
        items.push(...this.flattenDocumentTree(node.children));
      }
    });

    return items;
  }

  public handleNodeDrop(dragNode: TreeNode<string, DocumentTreeData>): void {
    const settings = this.schema.settings;

    const node = this.tree.getNode(dragNode.data.id) as TreeNode<any, DocumentTreeData>;

    const parent = node.parent;

    if (parent && parent.data.id) {
      node.data.__document.data[settings.treeViewField!] = {
        id: parent.data.id ?? '',
        schemaId: this.schemaId,
      };
    } else {
      node.data.__document.data[settings.treeViewField!] = null;
    }

    if (settings.treeViewSortField) {
      this.assignOrderToTree(this.documentTree);
    }
  }

  public async handleSaveTree(): Promise<void> {
    const settings = this.schema.settings;

    try {
      this.loading += 1;

      if (settings.treeViewSortField) {
        this.assignOrderToTree(this.documentTree);
      }

      const documents = this.flattenDocumentTree(this.documentTree);

      await Promise.all(
        chunk(documents, 15).map(chunk =>
          this.$store.dispatch(`${document.namespace}/updateManyDocuments`, {
            schemaId: this.schemaId,
            documents: chunk.map(c => {
              return {
                data: c.data,
                id: c.id,
              };
            }),
          }),
        ),
      );

      this.$message({
        message: 'Tree saved successfully!',
        type: 'success',
      });
    } catch (err) {
      console.log(err);

      this.$message({
        message: 'Unable to save tree, please try again later.',
        type: 'error',
      });
    } finally {
      this.$nextTick(() => {
        this.loading -= 1;
      });
    }
  }

  public assignOrderToTree(tree: DocumentTreeData[]): void {
    const settings = this.schema.settings;
    if (settings.treeViewSortField) {
      tree.forEach((node, i) => {
        node.__document.data[settings.treeViewSortField!] = i;

        if (node.children) {
          this.assignOrderToTree(node.children);
        }
      });
    }
  }

  @Watch('schemaId')
  async handleSchemaIdChange(): Promise<void> {
    try {
      this.loading += 1;

      await this.$store.dispatch(`${data.namespace}/fetchSchemaWithFieldsById`, {
        id: this.$route.params.id,
      });

      await this.fetchFindDocumentsBySchemaId(1);
    } catch (_) {
      this.$message({
        message: 'An error occurred whilst retrieving the tree, please try again later.',
        type: 'error',
      });
    } finally {
      this.$nextTick(() => {
        this.loading -= 1;
      });
    }
  }

  @Watch('documents', { immediate: true })
  handleDocumentsChange(): void {
    this.documentTree = this.makeDocumentTree();
  }

  beforeMount(): void {
    this.handleSchemaIdChange().then(() => this.handleDocumentsChange());
    this.$nextTick(() => {
      this.loading -= 1;
    });
  }
}
</script>

<style lang="scss">
.dockite-element--pagination {
  padding: 1rem;
}

.el-tree-node__content {
  border: 1px solid #eeeeee;
  height: 50px;
}

.dockite-tree--node {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-right: 0.8rem;

  span.dockite-tree--node-label {
    flex: 1;
  }

  .el-button + .el-button {
    margin-left: 0;
  }
}
</style>
