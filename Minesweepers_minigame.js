const grid = document.getElementById("grid");
const directions = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1], [0, 1],
    [1, -1], [1, 0], [1, 1],
]
let rows = 10;
let colums = 10;
let MineCount = 20;

let data = new Array();

grid.style.gridTemplateRows = `repeat(${rows},1fr)`;
grid.style.gridTemplateColumns = `repeat(${colums},1fr)`;

for(let i=0; i<colums; i++){
    for(let j=0; j<rows; j++){
        let item = document.createElement('div');
        item.textContent=`${i} ${j}`;
        item.id = `${i} ${j}`;
        grid.appendChild(item);
    }
    data.push(new Array(rows).fill(0));
}
for(let i=0; i<MineCount; i++){
    let x = Math.floor(Math.random()*colums);
    let y = Math.floor(Math.random()*rows);

    data[x][y]=-1;
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

console.log(data);

function BFS(startx, starty, target){
    let queue = Array([startx,starty]);
    let vis = Array();
    for(let i=0; i<colums; i++){
        vis.push(Array(rows).fill(0));
    }
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
                    if(vis[x2][y2]==0 && data[x2][y2]==target){
                        queue.push([x2,y2]);
                        vis[x2][y2]=1;

                        let obj = document.getElementById(`${x2} ${y2}`);
                        obj.textContent = data[x][y];
                        obj.style.backgroundColor = 'green';
                    }
                }
        }
        
    }
    

}


grid.addEventListener('click', function(event) {
    let x = Number(event.target.id.split(" ")[0]);
    let y = Number(event.target.id.split(" ")[1]);
    console.log(x,y,event.target.id);
    event.target.textContent = data[x][y];
    if(data[x][y]==-1){
        event.target.style.backgroundColor = 'red';
    } else{
        event.target.style.backgroundColor = 'green';
        if(data[x][y]==0){
            BFS(x,y,0);
        }
    }
    
})
