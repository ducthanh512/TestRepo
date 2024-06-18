export const files = [
  {
    name: 'Categories',
    type: 'folder',
    children: [
      {
        name: 'material2',
        type: 'folder',
        children: [
          { name: 'package.json', type: 'file' },
          { name: 'BUILD.bazel', type: 'file' },
        ],
      },
      {
        name: 'angular',
        type: 'folder',
        children: [
          { name: '.travis.yml', type: 'file' },
          { name: 'firebase.json', type: 'file' },
        ],
      },
      {
        name: 'angularjs',
        type: 'folder',
        children: [
          { name: 'gulpfile.js', type: 'file' },
          { name: 'README.md', type: 'file' },
        ],
      },
    ],
  },
];

// export const categoryList = [
//   'Coversheet',
//   'Disclosure Certificate',
//   'Victim Statement',
//   'Civilian Statement',
//   'Police Statement',
//   'Expert Statement',
//   'Exhibit',
//   'WitnessList',
//   'Multimedia',
//   'Misc',
// ];

export const categoryList = [
  {
    name:"Coversheet",
    numOfFiles:0
  },
  {
    name:"Disclosure Certificate",
    numOfFiles:0
  },
  {
    name:"Victim Statement",
    numOfFiles:0
  },
  {
    name:"Civilian Statement",
    numOfFiles:0
  },
  {
    name:"Police Statement",
    numOfFiles:0
  },
  {
    name:"Expert Statement",
    numOfFiles:0
  },
  {
    name:"Exhibit",
    numOfFiles:0
  },
  {
    name:"WitnessList",
    numOfFiles:0
  },
  {
    name:"Multimedia",
    numOfFiles:0
  },
  {
    name:"Misc",
    numOfFiles:0
  }

];


/** File node data with nested structure. */
export interface FileNode {
  name: string;
  type: string;
  children?: FileNode[];
}

/** Flat node with expandable and level information */
export interface TreeNode {
  name: string;
  type: string;
  level: number;
  expandable: boolean;
}

export const files2 = [
  {
    name: 'Categories',
    type: 'folder',
    children: [
      {
        name: 'material2',
        type: 'folder',
        children: [
          { name: 'package.json', type: 'file' },
          { name: 'BUILD.bazel', type: 'file' },
          
        ],
      },
      {
        name: 'angular',
        type: 'folder',
        children: [
          { name: '.travis.yml', type: 'file' },
          { name: 'firebase.json', type: 'file' },
          { name: 'haha new subject', type: 'file' },
        ],
      },
      {
        name: 'angularjs',
        type: 'folder',
        children: [
          { name: 'gulpfile.js', type: 'file' },
          { name: 'README.md', type: 'file' },
        ],
      },
    ],
  },
];
