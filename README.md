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

未完。。。


<br />