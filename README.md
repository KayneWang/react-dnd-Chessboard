## 本地开发

```shell
$ git clone https://github.com/wangzengkai/react-dnd-Chessboard.git
$ npm install
$ npm start
```

## react-dnd棋盘实现
方便快速理解react-dnd，官方提供了Chessboard例子，本项目是对官方例子的具体实现，为了方便初学者快速入手接下来笔者将会使用一些通俗易懂的表达方式一步一步完成此例子的开发。当然，您也可以访问[react-dnd文档](http://react-dnd.github.io/react-dnd/docs-tutorial.html)进行开发。
<br />

在开发过程中，笔者使用的是es6，如果不了解的话，可以参考阮一峰老师的[ECMAScript 6 入门](http://es6.ruanyifeng.com/)

## 环境准备
用户可以自行使用webpack搭建react的基础开发环境，这里推荐阅读[从零搭建React全家桶框架教程](https://github.com/brickspert/blog/issues/1)，当然也可以使用笔者自己使用的[react-webpack-boilerplate](https://github.com/wangzengkai/react-webpack-boilerplate)来快速开始。

## 确认组件
就像大多数开发一样，我们开发之前要大概确定一下所需要的组件，这里不绕弯子，直接按照文档所说，我们大概将组件分为以下三个：

- Knight，其中可以拖动的骑士组件
- Square，棋盘中的一个方块组件
- Board，整个棋盘面板，包含64个方块

思考一下组件是否需要props

- Knight不需要props，因为它在棋盘中肯定会作为Square的子组件
- Square中我们可以通过使用props来控制所在位置，但是这次我们并不需要，我们只需要Square来控制渲染颜色，因为棋盘是通过黑白两种颜色组成，当然Square会接收一个子组件
- Board比较麻烦，这里笔者感觉介绍太多并无太大作用，还是通过后续开发过程中来完善（主要是文档说了一堆考虑的问题，我不想在这个快速上手的文档中作介绍了，偷个懒）

## 开始开发

首先我们在src文件夹下面（如果没有src，请在根目录创建）创建components文件夹。
<br />

在components中创建Knight.js

```js
import React from 'react'

export default class Knight extends React.Component {
    render() {
        return <span>♘</span>
    }
}
```

接下来我们修改[react-webpack-boilerplate](https://github.com/wangzengkai/react-webpack-boilerplate)生成的src/index.js文件

```js
import React from 'react'
import ReactDom from 'react-dom'
import Knight from './components/Knight'

ReactDom.render(<Knight />, document.getElementById('app'))
```

然后我们就能看到如下效果：
![image](http://i.imgur.com/NktjTMn.png)

接下来我们要开始开发Square组件了，在src/components中创建Square.js

```js
import React from 'react'
import PropTypes from 'prop-types'

export default class Square extends React.Component {
    render() {
        const { black } = this.props
        const fill = black ? 'black' : 'white'
        const stroke = black ? 'white' : 'black'
        
        return (
            <div
                style={{
                    backgroundColor: fill,
                    color: stroke,
                    width: '100%',
                    height: 50
                }}
            >
                {this.props.children}
            </div>
        )
    }
}

Square.propTypes = {
    black: PropTypes.bool
}
```

接下来我们修改src/index.js
```js
import React from 'react'
import ReactDom from 'react-dom'
import Knight from './components/Knight'
import Square from './components/Square'

ReactDom.render(
    <Square black>
        <Knight />
    </Square>,
    document.getElementById('app')
)
```
然后可以看到如下效果（忽略高度，因为笔者这里设置的是50）：
![image](http://i.imgur.com/jvgv6DV.png)

最后，我们开始开发Board组件，在src/components中创建Board.js
```js
import React from 'react'
import PropTypes from 'prop-types'
import Square from './Square'
import Knight from './Knight'

export default class Board extends React.Component {
    render() {
        return (
            <div>
                <Square black>
                    <Knight />
                </Square>
            </div>
        )
    }
}

Board.propTypes = {
    knightPosition: PropTypes.arrayOf(
        PropTypes.number.isRequired
    ).isRequired
}
```

修改src/index.js
```js
import React from 'react'
import ReactDom from 'react-dom'
import Board from './components/Board'

ReactDom.render(
    <Board knightPosition={[0, 0]} />,
    document.getElementById('app')
)
```

下面，我们第一次尝试开发renderSquare方法，在src/components/Board.js中添加
```js
renderSquare(x, y) {
    const black = (x + y) % 2 === 1
    
    const [knightX, knightY] = this.props.knightPosition
    const piece = (x === knightX && y === knightY) ? <Knight /> : null
    
    return (
        <Square black={black}>
            {piece}
        </Square>
    )
}
```
改变Board中的render方法看一下效果
```js
render() {
    return (
        <div>
            {this.renderSquare(0, 0)}
            {this.renderSquare(1, 0)}
            {this.renderSquare(2, 0)}
        </div>
    )
}
```
下面我们优化一下代码，给我们的Board加上样式，同时遍历出64块Square
```js
import React from 'react'
import PropTypes from 'prop-types'
import Square from './Square'
import Knight from './Knight'

export default class Board extends React.Component {
    renderSquare(i) {
        const x = i % 8
        const y = Math.floor(i / 8)
        const black = (x + y) % 2 === 1
        
        const [knightX, knightY] = this.props.knightPosition
        const piece = (x === knightX && y === knightY) ? <Knight /> : null
        
        return (
            <div key={i} style={{ width: '12.5%', height: '12.5%' }}>
                <Square black={black}>
                    {piece}
                </Square>
            </div>
        )
    }
    
    render() {
        const squares = []
        for (let i = 0; i < 64; i++) {
            squares.push(this.renderSquare(i))
        }
        
        return (
            <div style={{ display: 'flex', flexWrap: 'wrap', width: 400 }}>
                {squares}
            </div>
        )
    }
}

Board.propTypes = {
  knightPosition: PropTypes.arrayOf(PropTypes.number.isRequired).isRequired
}
```

完成之后你应该可以看到如下效果了
![image](http://i.imgur.com/RsQDI4Y.png)

现在看起来好多了，我们尝试修改一下src/index.js中传递的knightPosition属性

```js
import React from 'react'
import ReactDom from 'react-dom'
import Board from './components/Board'

ReactDom.render(
    <Board knightPosition={[7, 4]} />,
    document.getElementById('app')
)
```

![image](http://i.imgur.com/0fNBn5a.png)

## 添加状态

文档作者在这里提到希望通过通过一个文件来控制KnightPosition，实际开发中的做法是使用Flux、Redux等，这里我们根据作者文档实现一个Game来改变我们的KnightPosition，首先改写src/index.js

```js
import React from 'react'
import ReactDom from 'react-dom'
import Board from './components/Board'
import { observe } from './components/Game'

const rootEl = document.getElementById('app')

observe(knightPosition => ReactDom.render(<Board knightPosition={knightPosition} />, rootEl))
```

接下来我们先实现一个初始版的Game，在src/components中创建Game.js文件

```js
export function observe(receive) {
    setInterval(() => receive([
        Math.floor(Math.random() * 8),
        Math.floor(Math.random() * 8)
    ]), 500)
}
```

现在我们可以看到

![image](https://s3.amazonaws.com/f.cl.ly/items/1K0s0n0r0C0e2P2N2D1d/Screen%20Recording%202015-05-15%20at%2012.06%20pm.gif)

修改src/components/Game.js

```js
let knightPosition = [0, 0]
let observer = null

function emitChange() {
    observer(knightPosition)
}

export function observe(o) {
    if (observer) {
        throw new Error('Multiple observers not implemented.')
    }
    observer = o
    emitChange()
}

export function moveKnight(toX, toY) {
    knightPosition = [toX, toY]
    emitChange()
}
```

现在，我们回到组件中，我们的目标是通过点击方块来移动Knight。作者这里提到了为什么使用Board来控制位置的原因（大概意思就是Square不需要确定自己的位置来渲染），修改src/components/Board.js，增加代码

```js
import React from 'react'
import PropTypes from 'prop-types'
import Square from './Square'
import Knight from './Knight'
import { moveKnight } from './Game'

/* 其它代码 */

renderSquare(i) {
  const x = i % 8
  const y = Math.floor(i / 8)
  const black = (x + y) % 2 === 1

  const [knightX, knightY] = this.props.knightPosition
  const piece = (x === knightX && y === knightY) ?
    <Knight /> :
    null

  return (
    <div key={i}
         style={{ width: '12.5%', height: '12.5%' }}
         onClick={() => this.handleSquareClick(x, y)}>
      <Square black={black}>
        {piece}
      </Square>
    </div>
  );
}

handleSquareClick(toX, toY) {
  moveKnight(toX, toY)
}
```

接下来我们需要定义一个移动规则，在src/components/Game.js中新增

```js
let knightPosition = [1, 7]

/* 其它代码 */

export function canMoveKnight(toX, toY) {
  const [x, y] = knightPosition;
  const dx = toX - x
  const dy = toY - y

  return (Math.abs(dx) === 2 && Math.abs(dy) === 1) ||
         (Math.abs(dx) === 1 && Math.abs(dy) === 2)
}
```

最后，修改src/components/Board.js

```js
import { canMoveKnight, moveKnight } from './Game'

/* 其它代码 */

handleSquareClick(toX, toY) {
  if (canMoveKnight(toX, toY)) {
    moveKnight(toX, toY)
  }
}
```

![image](https://s3.amazonaws.com/f.cl.ly/items/1F371u301l1H2X3o0g1h/Screen%20Recording%202015-05-15%20at%2012.08%20pm.gif)

## 添加拖拽交互

下面我们将看到如何使用React DnD来实现组件的拖拽功能

```shell
$ npm install --save react-dnd react-dnd-html5-backend
```

首先我们要设置DragDropContext，并且指定在应用中使用HTML5 backend

修改src/components/Board.js

```js
import React, { Component } from 'react'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'

class Board extends Component {
  /* 其它代码 */
}

export default DragDropContext(HTML5Backend)(Board)
```

然后，在src/components创建constants.js

```js
export const ItemTypes = {
  KNIGHT: 'knight'
}
```

DragSource高阶组件接受三个参数：type,spec,collect。本例中我们使用constants中定义的，所以我们现在需要开发drag source的规范和collecting方法。修改src/components/Knight.js，新增

```js
const knightSource = {
  beginDrag(props) {
    return {}
  }
}
```

因为我们这里没有需要描述的：在整个拖动应用中实际只有一个拖动对象。如果我们有很多棋子，我们就可以使用props参数来返回例如{pieceId: props.id}。在该例子中，空对象就可以满足条件了。

接下来我们需要开发collecting方法，用于返回Knight所需要的属性。我们必须得确定拖动源节点，或者我们可以调整拖动过程中的透明度等等。所以，我们需要知道当前节点是否正在被拖动。

修改src/components/Knight.js，新增

```js
function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  }
}
```

现在，我们整体看一下Knight组件

```js
import React from 'react'
import PropTypes from 'prop-types'
import { ItemTypes } from './Constants'
import { DragSource } from 'react-dnd'

const knightSource = {
  beginDrag(props) {
    return {}
  }
}

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  }
}

class Knight extends React.Component {
  render() {
    const { connectDragSource, isDragging } = this.props
    return connectDragSource(
      <div style={{ opacity: isDragging ? 0.5 : 1, fontSize: 25, fontWeight: 'bold', cursor: 'move' }}>
        ♘
      </div>
    )
  }
}

Knight.propTypes = {
  connectDragSource: PropTypes.func.isRequired,
  isDragging: PropTypes.bool.isRequired
}

export default DragSource(ItemTypes.KNIGHT, knightSource, collect)(Knight)
```

![image](https://s3.amazonaws.com/f.cl.ly/items/3L1d0C203C0s1r1H2H0m/Screen%20Recording%202015-05-15%20at%2001.11%20pm.gif)

现在Kinght已经是拖动源了，只是我们目前还没有放置目标。下面我们开始开发Square为放置目标。

这次，我们需要进行组件拆分了，具体原因作者文档描述的很详细，我们直接进行拆分。

在src/components中创建BoardSquare.js

```js
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Square from './Square'

export default class BoardSquare extends Component {
  render() {
    const { x, y } = this.props
    const black = (x + y) % 2 === 1

    return (
      <Square black={black}>
        {this.props.children}
      </Square>
    )
  }
}

BoardSquare.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired
}
```

修改src/components/Board.js

```js
renderSquare(i) {
  const x = i % 8
  const y = Math.floor(i / 8)
  return (
    <div key={i}
         style={{ width: '12.5%', height: '12.5%' }}>
      <BoardSquare x={x}
                   y={y}>
        {this.renderPiece(x, y)}
      </BoardSquare>
    </div>
  )
}

renderPiece(x, y) {
  const [knightX, knightY] = this.props.knightPosition
  if (x === knightX && y === knightY) {
    return <Knight />
  }
}
```

现在使用DropTarget封装BoardSquare，这里只写了一个放置目标规范的drop事件，修改src/components/BoardSquare.js，新增

```js
const squareTarget = {
  drop(props, monitor) {
    moveKnight(props.x, props.y)
  }
}
```

这里我们看到drop方法可以接受props，所以我们可以知道Knight是从那个位置移动过来的。在实际开发中，有可能会用到monitor.getItem()去检索从beginDrag返回的拖拽详情。

在collecting方法中，我们将获取连接放置目标节点的功能，并且我们可以通过monitor知道鼠标是否在当前BoardSquare中，这样我们才可以突出显示

```js
function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
  }
}
```

修改BoardSquare

```js
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Square from './Square';
import { canMoveKnight, moveKnight } from './Game';
import { ItemTypes } from './Constants';
import { DropTarget } from 'react-dnd';

const squareTarget = {
  drop(props) {
    moveKnight(props.x, props.y);
  }
};

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
  };
}

class BoardSquare extends Component {
  render() {
    const { x, y, connectDropTarget, isOver } = this.props;
    const black = (x + y) % 2 === 1;

    return connectDropTarget(
      <div style={{
        position: 'relative',
        width: '100%',
        height: '100%'
      }}>
        <Square black={black}>
          {this.props.children}
        </Square>
        {isOver &&
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: '100%',
            zIndex: 1,
            opacity: 0.5,
            backgroundColor: 'yellow',
          }} />
        }
      </div>
    );
  }
}

BoardSquare.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  connectDropTarget: PropTypes.func.isRequired,
  isOver: PropTypes.bool.isRequired
};

export default DropTarget(ItemTypes.KNIGHT, squareTarget, collect)(BoardSquare);
```

![image](https://s3.amazonaws.com/f.cl.ly/items/2U43301g421U3I2X2p0P/Screen%20Recording%202015-05-15%20at%2001.55%20pm.gif)

修改src/components/BoardSquare.js中的squareTarget对象，新增canDrop

```js
const squareTarget = {
  canDrop(props) {
    return canMoveKnight(props.x, props.y)
  },

  drop(props, monitor) {
    moveKnight(props.x, props.y)
  }
}
```

我们还需要在collecting方法中添加monitor.canDrop()，并且添加一些代码渲染效果

```js
import React from 'react'
import PropTypes from 'prop-types'
import Square from './Square'
import { moveKnight, canMoveKnight } from './Game'
import { ItemTypes } from './Constants'
import { DropTarget } from 'react-dnd'

const squareTarget = {
  canDrop(props) {
    return canMoveKnight(props.x, props.y)
  },

  drop(props, monitor) {
    moveKnight(props.x, props.y)
  }
}

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop()
  }
}

class BoardSquare extends React.Component {
  renderOverlay(color) {
    return (
      <div
        style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: '100%', zIndex: 1, opacity: 0.5, backgroundColor: color }}
      />
    )
  }
  render() {
    const { x, y, connectDropTarget, isOver, canDrop } = this.props
    const black = (x + y) % 2 === 1
    return (
      connectDropTarget(
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          <Square black={black}>
            {this.props.children}
          </Square>
          {isOver && !canDrop && this.renderOverlay('red')}
          {!isOver && canDrop && this.renderOverlay('yellow')}
          {isOver && canDrop && this.renderOverlay('green')}
        </div>
      )
    )
  }
}

BoardSquare.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  connectDropTarget: PropTypes.func.isRequired,
  isOver: PropTypes.bool.isRequired,
  canDrop: PropTypes.bool.isRequired
}

export default DropTarget(ItemTypes.KNIGHT, squareTarget, collect)(BoardSquare)
```

![image](https://s3.amazonaws.com/f.cl.ly/items/0X3c342g0i3u100p1o18/Screen%20Recording%202015-05-15%20at%2002.05%20pm.gif)

这样，我们的拖拽例子已经完成了

## 最后触发优化

可以参考[原文档](http://react-dnd.github.io/react-dnd/docs-tutorial.html)进行修改。


<br />
