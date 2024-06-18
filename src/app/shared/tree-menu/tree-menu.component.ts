import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, OnInit } from '@angular/core';
import {
  MatTreeFlatDataSource,
  MatTreeFlattener,
  MatTreeModule,
} from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { UploadServiceService } from '../../services/uploader-service.service';
import { TreeNode, FileNode } from '../../services/example-data';
import { FileUploadsByCategory } from '../../_model/file-upload.model';

/**
 * @title Tree with flat nodes
 */
@Component({
  selector: 'app-tree-menu',
  templateUrl: './tree-menu.component.html',
  styleUrl: './tree-menu.component.css',
  standalone: true,
  imports: [MatTreeModule, MatButtonModule, MatIconModule],
})
export class TreeMenuComponent implements OnInit {
  uploadtreeService: UploadServiceService;
  fileUploadsByCategories: FileUploadsByCategory[] = [];
  treeExpandingNodes: TreeNode[]=[];
  constructor(private uploadService: UploadServiceService) {
    this.uploadtreeService = this.uploadService;

    this.dataSource.data = this.uploadService.getJsonDate();
  }

  ngOnInit() {
    this.treeControl.expand(this.treeControl.dataNodes[0]);
    this.uploadtreeService.fileUploadsByCategories$.subscribe((data) => {
      this.dataSource.data = this.uploadService.updateTreeData();

      //Opening expanding tree nodes
      this.treeControl.expand(this.treeControl.dataNodes[0]);
      this.treeExpandingNodes.forEach(node => {
        var treeNode = this.treeControl.dataNodes.find(x=>x.name == node.name);
        this.treeControl.expand(treeNode!);
      } );

    });
    // console.log(data);
  }

  private _transformer = (node: FileNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      type: node.type,
      name: node.name,
      level: level,
    };
  };

  treeControl = new FlatTreeControl<TreeNode>(
    (node) => node.level,
    (node) => node.expandable
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    (node) => node.level,
    (node) => node.expandable,
    (node) => node.children
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  hasChild = (_: number, node: TreeNode) => node.expandable;

  addFileToTree() {
    this.dataSource.data = this.uploadtreeService.getJsonDate();
    this.treeControl.expand(this.treeControl.dataNodes[0]);
    this.treeControl.expand(
      this.treeControl.dataNodes[this.findCategoryIndexByName('angular')]
    );
  }

  findCategoryIndexByName(categoryName: string): number {
    let indexOfCategory = 0;
    const indexOfRootCategory = this.uploadtreeService.getJsonDate()[0].children!.findIndex((x) => x.name === categoryName);
    for (let i = 0; i < indexOfRootCategory; i++) {
      indexOfCategory +=
        this.uploadtreeService.getJsonDate()[0].children![i].children!.length + 1;
      console.log(indexOfCategory);
    }
    return indexOfCategory + 1;
  }


  nodeClicked(node:any) {
    
    let index = this.treeExpandingNodes.findIndex((n) => n.name === node.name);
    if(index == -1){
      this.treeExpandingNodes.push(node);
    }
    else{
      this.treeExpandingNodes.splice(index, 1)
    }
  }
}
