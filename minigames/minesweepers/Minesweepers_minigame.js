const grid = document.getElementById("grid");
const overlayLose = document.getElementById("overlayLose");
const overlayWin = document.getElementById("overlayWin");
const button = document.getElementById("button");
const directions = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1], [0, 1],
    [1, -1], [1, 0], [1, 1],
]
let rows = 10;
let colums = 10;
grid.style.gridTemplateRows = `repeat(${rows},1fr)`;
grid.style.gridTemplateColumns = `repeat(${colums},1fr)`;

let MineCount = 20;
let AmountOfFieldsUncovered = 0;
let data = new Array();
let vis = new Array();

function reset(){
    grid.textContent = '';
    AmountOfFieldsUncovered = 0;
    data = new Array();
    vis = new Array();
    for(let i=0; i<colums; i++){
        vis.push(Array(rows).fill(0));
    }


    for(let i=0; i<colums; i++){
        for(let j=0; j<rows; j++){
            let item = document.createElement('div');
            item.textContent="O"; //`${i} ${j}`
            item.id = `${i} ${j}`;
            grid.appendChild(item);
        }
        data.push(new Array(rows).fill(0));
    }
    for(let i=0; i<MineCount; i++){
        let x = Math.floor(Math.random()*colums);
        let y = Math.floor(Math.random()*rows);
        if(data[x][y]==-1) i--;
        else data[x][y]=-1;
    }
    for(let i=0; i<colums; i++){
        for(let j=0; j<rows; j++){
            if(data[i][j]==-1){
                for(let q=0; q<8; q++){
                    let dx = directions[q][0];
                    let dy = directions[q][1]
                    let x = i+dx;
                    let y = j+dy;
                    //console.log(x,y);
                    if(0 <= x && x < colums && 0 <= y && y < rows){
                        if(data[x][y]!=-1) data[x][y]+=1;
                    }
                }
            }
        }
    }
}
reset();

console.log(data);

function BFS(startx, starty, target){
    let queue = Array([startx,starty]);
    
    vis[startx][starty]=1;
    while(queue.length>0){
        let x = queue[0][0];
        let y = queue[0][1];
        queue.shift();
        for(let q=0; q<8; q++){
            let dx = directions[q][0];
            let dy = directions[q][1]
            let x2 = x+dx;
            let y2 = y+dy;
            //console.log(x,y);
            if(0 <= x2 && x2 < colums && 0 <= y2 && y2 < rows){
                if(vis[x2][y2]==0){
                    vis[x2][y2]=1;
                    
                    let obj = document.getElementById(`${x2} ${y2}`);
                    obj.textContent = data[x2][y2];
                    obj.style.backgroundColor = 'green';
                    AmountOfFieldsUncovered++;

                    if(data[x2][y2]==target){
                        queue.push([x2,y2]);
                    }
                }
            }
        }
    }
}



grid.addEventListener('click', function(event) {
    const mode = document.getElementById("mode").checked;

    let x = Number(event.target.id.split(" ")[0]);
    let y = Number(event.target.id.split(" ")[1]);
    //console.log(x,y,event.target.id);
    if(mode){
        if(vis[x][y]==0){
            if(event.target.textContent == "X"){
                event.target.textContent = "O";
                event.target.style.backgroundColor = '#f1f1f1';
            } else{
                event.target.textContent = "X";
                event.target.style.backgroundColor = 'orange';
            }
        }
    } else if(event.target.textContent == "O"){
        event.target.textContent = data[x][y];
        if(data[x][y]==-1){
            event.target.style.backgroundColor = 'red';
            overlayLose.style.display = 'block';
        } else if(vis[x][y]==0){
            event.target.style.backgroundColor = 'green';
            AmountOfFieldsUncovered++;
            vis[x][y]=1;
            if(data[x][y]==0){
                BFS(x,y,0);
            }
        }
    }
    console.log(AmountOfFieldsUncovered);
    if(AmountOfFieldsUncovered == colums*rows-MineCount){
        overlayWin.style.display = 'block';
    }
})
button.addEventListener('click', () => {
    reset();
    overlayLose.style.display = 'none';
})
