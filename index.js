let snapGridEl;
let moveableEl;
let dotEls;
let snappingOnEl;

document.addEventListener('DOMContentLoaded', (event) => {
  snapGridEl = document.getElementById("grid-container");
  moveableEl = document.getElementById("moveable");
  dotEls = document.querySelectorAll(".dot");
  snappingOnEl = document.getElementById("snapping-on")

  snapGridEl.addEventListener('mousemove', handleDotHighlights)
  moveableEl.addEventListener('mousedown', handleMoveStart)
  document.addEventListener('mousemove', handleMove)
  document.addEventListener('mouseup', handleMoveEnd)
  snappingOnEl.addEventListener("change", snappingOnChange)
})


const handleDotHighlights = (event) => {
  if (!snappingOn) return;
  if (!isMoving) return;
  // Get the mouse coords
  const mPoint = {x: event.clientX, y: event.clientY};
  const dotPoints = [];
  // deselect all dots
  // get every dots coords and store in dotPoints arr
  // if it is above and to left of cursor
  dotEls.forEach(d => {
    d.classList.remove("selected");
    const {x: dx, y: dy} = d.getBoundingClientRect();
    if (dx > mPoint.x || dy > mPoint.y) return;
    dotPoints.push({
      x: dx + (d.clientWidth / 2),
      y: dy + (d.clientHeight / 2),
      element: d
    })
  })
  // calculate dist of each dotPoint to mouse coords
  const dotDistances = dotPoints.map(dPoint => {
    return calcDist(dPoint, mPoint);
  })
  // find the smallest distance and gets its index
  const closestDist = Math.min(...dotDistances);
  const closestIndex = dotDistances.indexOf(closestDist);

  // if closest dot is within parameters
  // use index to set element color
  dotPoints[closestIndex].element.classList.add("selected");
}

const calcDist = (pointA, pointB) => {
  // euclidean distance alg 
  const a = pointA.x - pointB.x;
  const b = pointA.y - pointB.y;
  const c = Math.sqrt( a*a + b*b );
  return c;
  // c is the distance
}

const setBoundaries = (innerEl, outterEl) => {
  let innerRect = innerEl.getBoundingClientRect();
  let outterRect = outterEl.getBoundingClientRect();
  if (innerRect.top < outterRect.top) innerEl.style.top = outterRect.top + 'px';
  if (innerRect.right > outterRect.right) innerEl.style.left = (outterRect.right - innerRect.width) + 'px';
  if (innerRect.bottom > outterRect.bottom) innerEl.style.top = (outterRect.bottom - innerRect.height) + 'px';
  if (innerRect.left < outterRect.left) innerEl.style.left = outterRect.left + 'px';
}

let snappingOn = false;
const snappingOnChange = (event) => {
  snappingOn = event.target.checked;
}

let isMoving = false;
let offsetX;
let offsetY;

const handleMoveStart = (e) => {
  isMoving = true;
  console.log("starting...")
  var rect = e.target.getBoundingClientRect();
  offsetX = e.clientX - rect.left; //x position within the element.
  offsetY = e.clientY - rect.top;  //y position within the element.

  let outterRect = snapGridEl.getBoundingClientRect();
  console.log("top", rect.top, outterRect.top)
  console.log("right", rect.right, outterRect.right)
  console.log("bottom", rect.bottom, outterRect.bottom)
  console.log("left", rect.left, outterRect.left)
}

const handleMoveEnd = (e) => {
  isMoving = false;
  console.log("ending...")
}

const handleMove = (e) => {
  if (!isMoving) return;
  console.log("moving...")
  if (snappingOn) {
    moveWithSnapping(e)
  } else {
    moveableEl.style.top = (e.clientY - offsetY) + "px";
    moveableEl.style.left = (e.clientX - offsetX) + "px";
  }
  setBoundaries(moveableEl, snapGridEl);

}

const moveWithSnapping = (event) => {
  // Get the mouse coords
  const mPoint = {x: event.clientX, y: event.clientY};
  const dotPoints = [];
  // get every dots coords and store in dotPoints arr
  // deselect all dots
  dotEls.forEach(d => {
    const {x: dx, y: dy} = d.getBoundingClientRect();
    if (dx > mPoint.x || dy > mPoint.y) return;
    dotPoints.push({
      x: dx + (d.clientWidth / 2),
      y: dy + (d.clientHeight / 2),
      element: d
    })
  })

  // calculate dist of each dotPoint to mouse coords
  const dotDistances = dotPoints.map(dPoint => {
    return calcDist(dPoint, mPoint);
  })
  // find the smallest distance and gets its index
  const closestDist = Math.min(...dotDistances);
  const closestIndex = dotDistances.indexOf(closestDist);

  // use closestIndex to set position of moveable
  moveableEl.style.top = dotPoints[closestIndex].y + "px";
  moveableEl.style.left = dotPoints[closestIndex].x + "px";
}


