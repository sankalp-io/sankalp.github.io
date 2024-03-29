$(document).ready(function () {
  var input = $(".field").find("input, textarea");
  input.keyup(function () {
    inputTest(this);
  });
});

function inputTest(that) {
  var field = $(that).closest(".field");
  var form = $(that).closest("form, .form");
  var length = $.trim($(that).val()).length;

  //  FILLED
  if (length > 0) field.addClass("filled");
  else field.removeClass("filled");

  //  VALIDATED
  if (length >= 4) {
    field.addClass("validated");
    form.addClass("validated");
  } else {
    field.removeClass("validated");
    form.removeClass("validated");
  }
}
var Timer = {
  length: null,
  time: null,
  selector: null,
  interval: null,
  callback: null,

  //  RUN
  run: function (selector, callback, length) {
    Timer.length = length;
    Timer.time = Timer.length;
    Timer.selector = selector;
    Timer.callback = callback;
    $(Timer.selector).text(Timer.length);
    Timer.interval = setInterval(Timer.count, 1000);
  },

  //  COUNT
  count: function () {
    Timer.time = Timer.time - 1;
    $(Timer.selector).text(Timer.time);
    if (Timer.time <= 0) {
      if (typeof Timer.callback === "function" && Timer.callback)
        Timer.callback();
      Timer.reset();
    }
  },

  //  RESET
  reset: function () {
    clearInterval(Timer.interval);
    Timer.length = null;
    Timer.time = null;
    Timer.selector = null;
    Timer.interval = null;
    Timer.callback = null;
  },
};
var Identity = {
  duration: 1400,
  delay: 500,
  iteration: 0,
  processing: false,
  enough: false,
  interval: null,
  callback: null,
  status: "loading",
  id: "#identity",
  selector: "#identity div",
  classes: "working rest robot",

  //  WORK
  work: function () {
    if (Identity.status != "loading") Identity.status = "working";
    Identity.wait(function () {
      $(Identity.id).addClass("working");
    });
  },

  //  ROBOT
  robot: function () {
    Identity.status = "robot";
    Identity.wait(function () {
      $(Identity.id).addClass("robot");
    });
  },

  //  REST
  rest: function () {
    Identity.abort();
    Identity.status = "rest";
    setTimeout(function () {
      Identity.abort();
      $(Identity.id).addClass("rest");
    }, Identity.delay);
  },

  //  WAIT
  wait: function (call) {
    if (Identity.processing != true) {
      Identity.abort();
      Identity.processing = true;

      setTimeout(function () {
        if (typeof call === "function" && call) call();
        Identity.waiting();
        Identity.interval = setInterval(Identity.waiting, Identity.duration);
      }, Identity.delay);
    }
  },

  //  WAITING
  waiting: function () {
    if (Identity.enough != true) {
      ++Identity.iteration;
      return;
    }

    Identity.stopping();
  },

  //  STOP
  stop: function (callback) {
    setTimeout(function () {
      if (Identity.processing == true) {
        Identity.enough = true;
        Identity.callback = callback;

        $(Identity.selector).attr(
          "style",
          "animation-iteration-count: " +
            Identity.iteration +
            "; -webkit-animation-iteration-count: " +
            Identity.iteration +
            ";"
        );
      }
    }, Identity.delay);
  },

  //  STOPPING
  stopping: function () {
    clearInterval(Identity.interval);
    Identity.rest();

    if (typeof Identity.callback === "function" && Identity.callback)
      Identity.callback();
    Identity.reset();
  },

  //  ABORT
  abort: function () {
    if (Identity.status == "robot") $(Identity.id).removeClass("robot");
    else if (Identity.status != "loading" && Identity.processing != true)
      $(Identity.id).removeClass(Identity.classes + " loading");
    else $(Identity.id).removeClass(Identity.classes);
  },

  //  RESET
  reset: function () {
    Identity.iteration = 0;
    Identity.processing = false;
    Identity.enough = false;
    Identity.interval = null;
    Identity.callback = null;

    $(Identity.selector).removeAttr("style");
  },
};
var Stars = {
  canvas: null,
  context: null,
  circleArray: [],
  colorArray: [
    "#4c1a22",
    "#4c1a23",
    "#5d6268",
    "#1f2e37",
    "#474848",
    "#542619",
    "#ead8cf",
    "#4c241f",
    "#d6b9b1",
    "#964a47",
  ],

  mouseDistance: 50,
  radius: 0.5,
  maxRadius: 1.5,

  //  MOUSE
  mouse: {
    x: undefined,
    y: undefined,
    down: false,
    move: false,
  },

  //  INIT
  init: function () {
    this.canvas = document.getElementById("stars");
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.canvas.style.display = "block";
    this.context = this.canvas.getContext("2d");

    window.addEventListener("mousemove", this.mouseMove);
    window.addEventListener("resize", this.resize);

    this.prepare();
    this.animate();
  },

  //  CIRCLE
  Circle: function (x, y, dx, dy, radius, fill) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.radius = radius;
    this.minRadius = this.radius;

    this.draw = function () {
      Stars.context.beginPath();
      Stars.context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
      Stars.context.fillStyle = fill;
      Stars.context.fill();
    };

    this.update = function () {
      if (this.x + this.radius > Stars.canvas.width || this.x - this.radius < 0)
        this.dx = -this.dx;
      if (
        this.y + this.radius > Stars.canvas.height ||
        this.y - this.radius < 0
      )
        this.dy = -this.dy;

      this.x += this.dx;
      this.y += this.dy;

      //  INTERACTIVITY
      if (
        Stars.mouse.x - this.x < Stars.mouseDistance &&
        Stars.mouse.x - this.x > -Stars.mouseDistance &&
        Stars.mouse.y - this.y < Stars.mouseDistance &&
        Stars.mouse.y - this.y > -Stars.mouseDistance
      ) {
        if (this.radius < Stars.maxRadius) this.radius += 1;
      } else if (this.radius > this.minRadius) {
        this.radius -= 1;
      }

      this.draw();
    };
  },

  //  PREPARE
  prepare: function () {
    this.circleArray = [];

    for (var i = 0; i < 1200; i++) {
      var radius = Stars.radius;
      var x = Math.random() * (this.canvas.width - radius * 2) + radius;
      var y = Math.random() * (this.canvas.height - radius * 2) + radius;
      var dx = (Math.random() - 0.5) * 1.5;
      var dy = (Math.random() - 1) * 1.5;
      var fill =
        this.colorArray[Math.floor(Math.random() * this.colorArray.length)];

      this.circleArray.push(new this.Circle(x, y, dx, dy, radius, fill));
    }
  },

  //  ANIMATE
  animate: function () {
    requestAnimationFrame(Stars.animate);
    Stars.context.clearRect(0, 0, Stars.canvas.width, Stars.canvas.height);

    for (var i = 0; i < Stars.circleArray.length; i++) {
      var circle = Stars.circleArray[i];
      circle.update();
    }
  },

  //  MOUSE MOVE
  mouseMove: function (event) {
    Stars.mouse.x = event.x;
    Stars.mouse.y = event.y;
  },

  //  RESIZE
  resize: function () {
    Stars.canvas.width = window.innerWidth;
    Stars.canvas.height = window.innerHeight;
  },
};
var renderer, scene, camera, ww, wh, particles;

(ww = window.innerWidth), (wh = window.innerHeight);

var centerVector = new THREE.Vector3(0, 0, 0);
var previousTime = 0;
speed = 10;
isMouseDown = false;

// var getImageData = function (image) {
//   var canvas = document.createElement("canvas");
//   canvas.width = image.width;
//   canvas.height = image.height;

//   var ctx = canvas.getContext("2d");
//   ctx.drawImage(image, 0, 0);

//   return ctx.getImageData(0, 0, image.width, image.height);
// };
function getImageData(image) {
  var canvas = document.createElement("canvas");
  var ctx = canvas.getContext("2d");

  // Set the size of the new canvas
  var newWidth = image.width * 1.75; // Double the width
  var newHeight = image.height * 1.75; // Double the height
  canvas.width = newWidth;
  canvas.height = newHeight;

  // Draw the original image onto the new canvas
  ctx.drawImage(image, 0, 0, newWidth, newHeight);

  return ctx.getImageData(0, 0, newWidth, newHeight);
}

function getPixel(imagedata, x, y) {
  var position = (x + imagedata.width * y) * 4,
    data = imagedata.data;
  return {
    r: data[position],
    g: data[position + 1],
    b: data[position + 2],
    a: data[position + 3],
  };
}

var drawTheMap = function () {
  var geometry = new THREE.Geometry();
  var material = new THREE.PointCloudMaterial();
  material.vertexColors = true;
  material.transparent = true;
  for (var y = 0, y2 = imagedata.height; y < y2; y += 1) {
    for (var x = 0, x2 = imagedata.width; x < x2; x += 1) {
      if (imagedata.data[x * 4 + y * 4 * imagedata.width] > 0) {
        var vertex = new THREE.Vector3();
        vertex.x = x - imagedata.width / 2 + (500 - 440 * 0.5);
        vertex.y = -y + imagedata.height / 2;
        vertex.z = -Math.random() * 500;

        vertex.speed = Math.random() / speed + 0.015;

        var pixelColor = getPixel(imagedata, x, y);
        var color =
          "rgb(" +
          pixelColor.r +
          ", " +
          pixelColor.g +
          ", " +
          pixelColor.b +
          ")";
        geometry.colors.push(new THREE.Color(color));
        geometry.vertices.push(vertex);
      }
    }
  }
  particles = new THREE.Points(geometry, material);

  scene.add(particles);

  requestAnimationFrame(render);
};

var init = function () {
  renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById("yahia"),
    antialias: true,
    alpha: true,
  });
  renderer.setSize(ww, wh);

  scene = new THREE.Scene();

  camera = new THREE.OrthographicCamera(
    ww / -2,
    ww / 2,
    wh / 2,
    wh / -2,
    1,
    1000
  );
  camera.position.set(0, -20, 4);
  camera.lookAt(centerVector);
  scene.add(camera);
  camera.zoom = 1;
  camera.updateProjectionMatrix();

  imagedata = getImageData(image);
  drawTheMap();

  window.addEventListener("mousemove", onMousemove, false);
  window.addEventListener("mousedown", onMousedown, false);
  window.addEventListener("mouseup", onMouseup, false);
  window.addEventListener("resize", onResize, false);
};
var onResize = function () {
  ww = window.innerWidth;
  wh = window.innerHeight;
  renderer.setSize(ww, wh);
  camera.left = ww / -2;
  camera.right = ww / 2;
  camera.top = wh / 2;
  camera.bottom = wh / -2;
  camera.updateProjectionMatrix();
};

var onMouseup = function () {
  isMouseDown = false;
};
var onMousedown = function (e) {
  isMouseDown = true;
  lastMousePos = { x: e.clientX, y: e.clientY };
};
var onMousemove = function (e) {
  if (isMouseDown) {
    camera.position.x += (e.clientX - lastMousePos.x) / 100;
    camera.position.y -= (e.clientY - lastMousePos.y) / 100;
    camera.lookAt(centerVector);
    lastMousePos = { x: e.clientX, y: e.clientY };
  }
};

var render = function (a) {
  requestAnimationFrame(render);

  particles.geometry.verticesNeedUpdate = true;
  if (!isMouseDown) {
    camera.position.x += (0 - camera.position.x) * 0.06;
    camera.position.y += (0 - camera.position.y) * 0.06;
    camera.lookAt(centerVector);
  }

  renderer.render(scene, camera);
};

var imgData =
  " data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAbAAAAJACAYAAADsNDOuAAAAAXNSR0IArs4c6QAAAARzQklUCAgICHwIZIgAACAASURBVHic7N17rGxZftj173rsXa/zuO++/Zru9kz3uHtm2uPEYyc2JnFsRBLhOCYJyigiIAspAQIGgYJiIRRA+SPGQkQggYQsIWFAIgpCBFDyB38QB0xQQmJnnLE9Y4/7Md19u+/rPOqx93rxx6o6t27dqlNV531r/5bUfc+pvff6rN+uqvu7a++11oZnix7/N+/148qy7avuL774m+43OXbxxT9rf23oJBUvapz44m+63+TYxRf/QvzjDpjdppe8vmojxBdf/GbHLr74Z+GvVeGi7au8vkpg4ou/KX6TYxdf/Ivy127YvO2rZuFlX3Txxd9Uv8mxiy/+eflLy0kau06d4ovfJL/JsYsv/ln5544fd9xFBC+++FfBb3Ls4ot/Yf6ibKeXHLxqN/Ck3VLxxX8e/cu0Lzt28cW/CP/UX8zTFvHFb6rf5NjFF/9c/HkHLsqOp6lTfPGb4Dc5dvHFvzR/WWWrHHeaLC6++M+7f5n2ZccuvvgX7c894LK6meKL31S/ybGLL/6J/VUbddbZVXzxm+A3OXbxxT8X/ywzqZ5T37L6xRd/U/0mxy6++BfpL6x0EbJuxlz1iy2++JviNzl28cW/bH+tg+Y19jT1iS/+pvpNjl188c/aX7jTmWbAJceJL/4m+02OXXzxL9s/cQWLuo/ncSLEF/8q+U2OXXzxL8VfZad1u4zr1C+++JvqNzl28cW/bP9E5cIg8cW/Yn6TYxdf/Mv2jy2zjVvlGudZBiS++M+D3+TYxRf/Ivyl4EVmUvHFb6rf5NjFF/9U/roNnbf/Ktl22b9UxRd/U/0mxy6++OfmL8p4x3UVl2XJdbqO4ou/iX6TYxdf/HP31818qzbkPI8RX/xN8Jscu/jin6W/cqXLMu+q9YgvvvhXxxZf/E3x1658ne7iqnWKL/4m+02OXXzxz/y7Mm+nk2TZ2ddXbaj44m+if5n2ZccuvvgX6Z+6rIOeRyPEF/8q+k2OXXzxL8J/pit4HLpKg07apRRf/Kb5TY5dfPFP4y9tyGmy5Um+xOKL3zS/ybGLL/6p/FV3nM2CK2XFE9Qlvvib7Dc5dvHFP2t/7s6LMuKqyCpl0f7ii7/pfpNjF1/8s/bXhk5S8arZVnzxN81vcuzii38h/nEHzG7TS15ftRHiiy9+s2MXX/yz8NeqcNH2VV5fJTDxxd8Uv8mxiy/+RflrN2ze9lWz8LIvuvjib6rf5NjFF/+8/KXlJI1dp07xxW+S3+TYxRf/rPxzx4877iKCF1/8q+A3OXbxxb8wf1G200sOXrUbeNJuqfjiP4/+ZdqXHbv44l+Ef+ov5mmL+OI31W9y7OKLfy7+vAMXZcfT1Cm++E3wmxy7+OJfmr+sslWOO00WF1/8592/TPuyYxdf/Iv25x5wWd1M8cVvqt/k2MUX/8T+qo066+wqvvhN8Jscu/jin4t/lplUz6lvWf3ii7+pfpNjF1/8i/QXVroIWTdjrvrFFl/8TfGbHLv44l+2v9ZB8xp7mvrEF39T/SbHLr74Z+0v3OlMM+CS48QXf5P9JscuvviX7Z+4gkXdx/M4EeKLf5X8JscuvviX4q+y07pdxnXqF1/8TfWbHLv44l+2f6JyYZD44l8xv8mxiy/+ZfvHltnGrXKN8ywDEl/858Fvcuzii38R/lLwIjOp+OI31W9y7OKLfyp/3YbO23+VbLvsX6rii7+pfpNjF1/8c/MXZbzjuorLsuQ6XUfxxd9Ev8mxiy/+ufvrZr5VG3Kex4gv/ib4TY5dfPHP0l+50mWZd9V6xBdf/Ktjiy/+pvhrV75Od3HVOsUXf5P9Jscuvvhn/l2Zt9NJsuzs66s2VHzxN9G/TPuyYxdf/Iv0T13WQc+jEeKLfxX9JscuvvgX4T/TFTwOXaVBJ+1Sii9+0/wmxy6++KfxlzbkNNnyJF9i8cVvmt/k2MUX/1T+qjvOZsGVsuIJ6hJf/E32mxy7+OKftT9350UZcVVklbJof/HF33S/ybGLL/5Z+2tDJ6l41Wwrvvib5jc5dvHFvxD/uANmt+klr6/aCPHFF7/ZsYsv/ln4a1W4aPsqr68SmPjib4rf5NjFF/+i/LUbNm/7qll42RddfPE31W9y7OKLf17+0nKSxq5Tp/jiN8lvcuzii39W/rnjxx13EcGLL/5V8Jscu/jiX5i/KNvpJQev2g08abdUfPGfR/8y7cuOXXzxL8I/9RfztEV88ZvqNzl28cU/F3/egYuy42nqFF/8JvhNjl188S/NX1bZKsedJouLL/7z7l+mfdmxiy/+RftzD7isbqb44jfVb3Ls4ot/Yn/VRp11dhVf/Cb4TY5dfPHPxT/LTKrn1LesfvHF31S/ybGLL/5F+gsrXYSsmzFX/WKLL/6m+E2OXXzxL9tf66B5jT1NfeKLv6l+k2MXX/yz9hfudKYZcMlx4ou/yX6TYxdf/Mv2T1zBou7jeZwI8cW/Sn6TYxdf/EvxV9lp3S7jOvWLL/6m+k2OXXzxL9s/UbkwSHzxr5jf5NjFF/+y/WPLbONWucZ5lgGJL/7z4Dc5dvHFvwh/KXiRmVR88ZvqNzl28cU/lb9uQ+ftv0q2XfYvVfHF31S/ybGLL/65+Ysy3nFdxWVZcp2uo/jib6Lf5NjFF//c/XUz36oNOc9jxBd/E/wmxy6++Gfpr1zpssy7aj3iiy/+1bHFF39T/LUrX6e7uGqd4ou/yX6TYxdf/DP/rszb6SRZdvb1VRsqvvib6F+mfdmxiy/+RfqnLuug59EI8cW/in6TYxdf/Ivwn+kKHoeu0qCTdinFF79pfpNjF1/80/hLG3KabHmSL7H44jfNb3Ls4ot/Kn/VHWez4EpZ8QR1iS/+JvtNjl188c/an7vzooy4KrJKWbS/+OJvut/k2MUX/6z9taGTVLxqthVf/E3zmxy7+OJfiH/cAbPb9JLXV22E+OKL3+zYxRf/LPy1Kly0fZXXVwlMfPE3xW9y7OKLf1H+2g2bt33VLLzsiy6++JvqNzl28cU/L39pOUlj16lTfPGb5Dc5dvHFPyv/3PHjjruI4MUX/yr4TY5dfPEvzF+U7fSSg1ftBp60Wyq++M+jf5n2ZccuvvgX4Z/6i3naIr74TfWbHLv44p+LP+/ARdnxNHWKL34T/CbHLr74l+Yvq2yV406TxcUX/3n3L9O+7NjFF/+i/bkHXFY3U3zxm+o3OXbxxT+xv2qjzjq7ii9+E/wmxy6++Ofin2Um1XPqW1a/+OJvqt/k2MUX/yL9hZUuQtbNmKt+scUXf1P8JscuvviX7a910LzGnqY+8cXfVL/JsYsv/ln7C3c60wy45Djxxd9kv8mxiy/+ZfsnrmBR9/E8ToT44l8lv8mxiy/+pfir7LRul3Gd+sUXf1P9JscuvviX7Z+oXBgkvvhXzG9y7OKLf9n+sWW2catc4zzLgMQX/3nwmxy7+OJfhL8UvMhMKr74TfWbHLv44p/KX7eh8/ZfJdsu+5eq+OJvqt/k2MUX/9z8RRnvuK7isiy5TtdRfPE30W9y7OKLf+7+uplv1Yac5zHii78JfpNjF1/8s/RXrnRZ5l21HvHFF//q2OKLvyn+2pWv011ctU7xxd9kv8mxiy/+mX9X5u10kiw7+/qqDRVf/E30L9O+7NjFF/8i/VOXddDzaIT44l9Fv8mxiy/+RfjPdAWPQ1dp0Em7lOKL3zS/ybGLL/5p/KUNOU22PMmXWHzxm+Y3OXbxxT+Vv+qOs1lwpax4grrEF3+T/SbHLr74Z+3P3XlRRlwVWaUs2l988Tfdb3Ls4ot/1v7a0EkqXjXbii/+pvlNjl188S/EP+6A2W16yeurNkJ88cVvduzii38W/loVLtq+yuurBCa++JviNzl28cW/KH/ths3bvmoWXvZFF1/8TfWbHLv44p+Xv7ScpLHr1Cm++E3ymxy7+OKflX/u+HHHXUTw4ot/Ffwmxy6++BfmL8p2esnBq3YDT9otFV/859G/TPuyYxdf/IvwT/3FPG0RX/ym+k2OXXzxz8Wfd+Ci7HiaOsUXvwl+k2MXX/xL85dVtspxp8ni4ov/vPuXaV927OKLf9H+3AMuq5spvvhN9Zscu/jin9hftVFnnV3FF78JfpNjF1/8c/HPMpPqOfUtq1988TfVb3Ls4ot/kf7CShch62bMVb/Y4ou/KX6TYxdf/Mv21zpoXmNPU5/44m+q3+TYxRf/rP2FO51pBlxynPjib7Lf5NjFF/+y/RNXsKj7eB4nQnzxr5Lf5NjFF/9S/FV2WrfLuE794ou/qX6TYxdf/Mv2T1QuDBJf/CvmNzl28cW/bP/YMtu4Va5xnmVA4ov/PPhNjl188S/CXwpeZCYVX/ym+k2OXXzxT+Wv29B5+6+SbZf9S1V88TfVb3Ls4ot/bv6ijHdcV3FZllyn6yi++JvoNzl28cU/d3/dzLdqQ87zGPHF3wS/ybGLL/5Z+itXuizzrlqP+OKLf3Vs8cXfFH/tytfpLq5ap/jib7Lf5NjFF//MvyvzdjpJlp19fdWGii/+JvqXaV927OKLf5H+qcs66Hk0Qnzxr6Lf5NjFF/8i/Ge6gsehqzTopF1K8cVvmt/k2MUX/zT+0oacJlue5EssvvhN85scu/jin8pfdcfZLLhSVjxBXeKLv8l+k2MXX/yz9ufuvCgjroqsUhbtL774m+43OXbxxT9rf23oJBWvmm3FF3/T/CbHLr74F+Ifd8DsNr3k9VUbIb744jc7dvHFPwt/rQoXbV/l9VUCE1/8TfGbHLv44l+Uv3bD5m1fNQsv+6KLL/6m+k2OXXzxz8tfWk7S2HXqFF/8JvlNjl188c/KP3f8uOMuInjxxb8KfpNjF1/8C/MXZTu95OBVu4En7ZaKL/7z6F+mfdmxiy/+Rfin/mKetogvflP9Jscuvvjn4s87cFF2PE2d4ovfBL/JsYsv/qX5yypb5bjTZHHxxX/e/cu0Lzt28cW/aH/uAZfVzRRf/Kb6TY5dfPFP7K/aqLPOruKL3wS/ybGLL/6Z+mrqhXjSFi2oPM68dlz94ou/qf6Nouh+XmvzdWP0j0ZFixCtMrqtojLA4xDDt2N0/zOEf+yc+7VTtOWqxS6++OfqqwWvz1a6CFkVn+w3vf9xx4ov/vPgX4PiixDvoM1XQb1CSndB3VBKdZRSt5TRLxjTarXbLaW1JsZISgmlFKXSxJTwzuO8x4dASsGl5N4H9ZdDGP3SFY5dfPEv3V+UwJY1Ztn2dYMTX/znwX8Tyq9qnf5Qgh8EXtW2fU0rY7UxCiCllCvWGqM1PoScrMoCpRQxRpRSGGNoG4PzAe88MT5pRog1PvjkXP2rMdY/Bjy+ArGLL/6V82cT2LydTpuB1zlOfPGvmN/6SZT+GWXsDyld3jDaltoYpVT+6tTaoxSoZNFKEfXM0cZC8iQXQDms0qBjTmS6hbUWpRTOOULtUUqhtCKGiDFweHjwcQqj3w+8d/GxX/a5F1/84/11e2CrNGTZ/qt2JcUX/9J8bTv/Lkn/rDLlS8a2dFFYjDEAxJjw3pMSFD2L0gqVbN6mci9s8p9GoVLuYekUMESSypcRtWkf1emcI7qQ61I5gSUCznliqL4d3OhtwF9E7GvUJ774l+qveg/suH1O0pBVu6Pii3+hflG0/0uS/boxxS5A1ApjCgprj3pLKSpC8qSgCDaitUbpAq0VWpujy4gpRZwPqOQzmkLeFvLvmHF9KeG8h5AwOnfhQoyE4FBKQfDUvvolovsXzzP2FbeLL/6V8c2CHdIKDUkzfy4Dp/dbdoz44l+wX76jlflVY4ofa5VFuygNhSlxMZCvFiZiYjwAA4wxlIWhDvmyX1I6X/5TT/5NqJQ6SkQAetw7iyEQQyQwTlQ+kGJCodDj42OMpJjvnykSKcW3U1J/B+J7Zx/7U6WB7734z6t/0kuIkzKbLVe5xnnSrqP44p+PX5bvmqB+xRjbLY3FGosyuSc0+YaklEghv6aUwliTE5QeXzrMm44SWCL/2zDFQFWPMjPex4eA9wEzvgCiVE5cxhq01qToj/aZlNxzq3/DueHbZxr7yYv44l+6v6gHNsma09lzNpOywu/ztq2TtcUX/9x9g/2Noii3tc7D2mMIkEAbTWJyOTCRUiSERAgB7z3eB6KOeBeI0RFdpA6eEAIxeoJPGJN7UyFErCYnqJTyqMOY61ZTyStb8egyZIx5yH1RGAz6ZoDDFMOvnFXsc0qj3nvxn29/lVGIy7DZ/VfJtou2iS/+hfqmaP89bVo/CKDTkzla1hiMNYTajQ/JXxU/lVyUUrgYAItS+c80HoShlEIlQ7tj8z0ul+97WTsZtOFJIR7ta7QGFUkxEcZzxYzRBB9QWmOtxvuIq4fvp1C9DYxOG/uKry8qz/17L/7z75vZF6Z+XpT9pn9Xc/abzrbzsinMz8Tii3+hvtatP1f2dv4cEVIKoDRFUVAWlhQTrnKYyaXElHLv7Ch5jXtOCawiXwLUYABDIsUIKaCVOZoPFmJE6fElxpjQM/fMcs8tklIEEkYblFZopVGoib2r0Dsphb/1PJ978cU/C1/NHHzacpK6xBf/Uvxud+ezSrdvxdqjTcpztlREx5xA0ngoe6HNeLSgwo0TEYwTmHoyZD63QKG1Rqs8L2zoHMYYKu8oyxZaK8qyw2hUEXwN4ySm9ZNEFmNOgNZa0tT3NyU9vhxZ70VX/7Pg/t5JYz/FMWdZl/jin8qfN4hjWaWz2XLdruKyIr745++b9s+0i+IXR0ljx3OxWlZjjaYaDnF1TbuwGA2MRwMWpkW716HX7dBptSkKS93fH480DDjnGHpHVdVUdV4eCt2iKEsq75h83Tq9LgbLwbD/ZNBHevYfpu1WmS8nxjROZOYoWUY/+kfeDX4ceHiCc7ioNOO9F39j/HVGIa7S4HUbvs7+4ot/dr6y/0thy58se9tUtaOwClKk7g9oWUOn0FTDikjg1rVdPvfyS7zy4l1u3riOtS18ygM52skfDcqoasfI1QyGI/qDAVXt+M0PPqbygeHIEdEAtLttVFLULt9fi+OkFKZymNKaosj3z0j5uOlkF1NiNNj7f0jmT8PovTXP5bLzuc6+z997L/7G+GrJTifJsrOvr9pQ8cW/MF/p4tuFLT9fh0BhS7TyFMZgSYwGA7a7BV9843W+8MordLsder0erbIEIMYERmOMRvshWimSUpASdYC6rqnqmqoKvPfRJ3z2eJ/H/QH7g4q6dihl8CGgi+Kpy48uke+dwdGlRQCtLUZr9NT9uBTz5Gfvh9+Oyf0reP9/rhr7iudyY9978TfHP+08sFUasmjbSbuZ4ot/al+bcq+w5U67NHgfUNS4yrPTKfjBd97mrbfeQEdPr13SLlu02+2jwRjeRZImD4mfrKoxLjFGYgjUIV9W3O879vsDHu0f8rsffcLDwz6jYV5aqlL66H7aZAUOH0LuianJ7WmOFgZW9unJ0ikoRqMK74Z9pdI/1Fb9fKgGf3OF89Lo9178zfHn9cAWdQmnf1+lQSftUoov/nn7L1jb+dBaa20YorXm+k6X73/rTb7y9pu0jCKGmmtbWxg9Hu40Xg5KqfHyT2o8gDcFkgePJ7pEwONDIniPj1DVUMXEcFTzyYP7PDwY8OCgz6A/4uGoxtUOH0JOUONlperx3C+lzFM9tKQVRWGxZjzh2T+ZFK2VwhYqqRQe+FD9wrB/8Fev6LkXX/wz86eH0U+GRc4OhZx9HZ4dCjlvaOS8IZTHFfHFvyDf/r6ybP3LhbUU1HzPSy/woz/wfbzz5huUBkwKtDsGGwOkmuQrLBFroNSaQoNOHh0dGI1OoFREpQQqMlmLQyuVH5eSIqAIKdFrd7BGYZXBqTxROob8fTwaUq81WmnS1L8vY8oDOY4Ge6REjBqURhuDsQXGGKV00TW2/Amjyp8pWuXQ1dU/uFrnXnzxz843UzvOy5jTB+uZn+fNA5h3/Lwyry7xxb8QX2vzr3c6nR8uioK3X77D177vXT7/Pa9QaoVKka12SWEAV1NYaBUFRVlgtCaFQAieGPx4ZQ6IMZBiJJFHDBJCXjcxgClaQGRUeR7u7eVVNlAU1hBNQYiR2vs80nDS01J57pdz/ugEaKXyz+MRjz4EFPZo7hiANTo/0iUmQmJ3q7f1z5Vl+y8opX7b+/qbV+Hciy/+WfpmZsd5DZyU6dfmZcV1Mu70/uKLf6F+p2X/s2u75e0Xbu/y0z/ye3jx2jYt5TDB0dERq/IcMK0tIVmSKkm6Q6DA+Yh3iaQ01hQkP8DHOq8wHz0pRmKI+OhBK1ztSSrhXU3tHMPBIdWwwtUjamex2lDYPNrQjxNTjHmUodZ5IV9FIhExKaJJGJUnSxNrNB6Nx5D9GGqIHk0kRo+CrjXmT2hjP3Gu/v8u+9yLL/5Z+vPWQlyU+eY1cNn22X1nGzKviC/+ufk3b978orXqP/ie115Rf+QP/tN0TZ5vpbVBpwRKk5QmoVFao4sSrQuwGmMtZdmmbLVxPjDoD8BESlsQU8K5iNIapccreYT8PK+UAGOoas/hYETtPFpp9ut8r6waJzcf8uNWJoFMD9hQSqFnAppexSPx9A3t6WeSKa21MeaPKGO/6139Dy/r3K+wv/jir+XPLiU1u+O8yqZ/n82Wi/abbdy8Ir745+7fvnXjF3/k+7/8vT/4/V9le6vHdmmxpcXq/LwvbQ26KPMlw1aXpAtaW9vYTpeIJoRAArQ1WFtS+xGmKAlKE4MClfcJIWCNpfbj/Y0lRPJ6ht4zCp5BBZVzjOoa5/N8MgXEqaQ1+XM2gU3Pe84/T12CHCdBxeS5YhGF0kbpP2pQv+6D/yZPl0a89+Jvnm/mHDDvoNltixo1G9S8Rizqboov/rn677zz1o//U7/3K3/lB979Mi++cJdQObY6BUobTGkwxo5rMSRriVFh222SNiTdQpsWtmyBtTjn6Q/r8XJPBu8TaI22Cl87qrrGWJ2H3CdwKaG0QZsCFyP7BwOqaHDeUzmXV8DXKq+VqPO9rElC0lqREkfPE4PxKHueTmRHQU9GLiqVh/WPFwdOCZO0+iml7P8eo/vkIs/9grrFF/9Uvp3ZOLmZdtwwyXWGTE62zR4/7xjxxT9X/503XvtfX3/xJVpFyeDxQ3a2trBA1CGvxBEi/RAYDocMRzX9Yc29+3v4BLoo2d7aorfVomUKWragvXMdVx2iCDiXmbZSFO0S5xyDwYCkzLjnBT5pClvQ7WzR2/a4UcSngKkrgn7y6BY1/t9kfcQYn3yHn5oHlvL3+OneWDraPklck5/Hx7eNMf+XUtu/p64PfuOizv3U8Y387Il/Pr49ZuPs63rBz9ONmq1jnTrFF//c/He//OWfNzG1rTG0CoMpOrStRZtEippWYakrhwuB/mDEw/1D7t1/xIODAf2Rw/lIGieUllHcvn6DF1+4Q7dl2Nnq0u5u4esRdTVCj1e1r0NFCLl5xhpcHRl5h7KGmzduMLi/j60qjDHoEAgxTHpKT/17Vmt1lMSeuu810xubfT3GiFI6DwY56o0ltFYdY9T/Dbc/B58dnve5X6FO8cU/ka+fOWRxWYQs2zZd1vHEF//M/I4u/nh0AXc4YLR/iAo1cdQHH9Apr/7uQo13jqASSUPtIhGDi+CUxpZttrZ3KdpdHvWHfOt33+f9j+/x/ief0R94lClwITEajYgkCmuJKWG0xqJJUREiOJ+oXCCqRCSRFE+e/BwTOkZMSkf/WaDU+anNMHWJkKcT2qSkxFGPK6WctJ5Ndur6zlb4daA873M/Lo397Il/fr6d89qibDdpwLxsO7vvotfjnN/FF/9c/ddee+0Fk+LnOtri3IhC7RCHI3Sngw9DiArnoRrkNQwtmm67Q3dni1oNaHV20KWlKFpYFfOIwbompsiDwz6ffPaAajDi8597EW0MVQUu5sel6GhAk9ctjAmtNaNqyL3PHlFbOx42H4+eMwbjy4RaQXz6kuEkyDBePFhN3SebV4wxeUBJ9MSo0NocPccsr9zR/tz21o1vHBw+fOu8zj0N/+yJf76+mdph8k2YvYE22Tbvxh0z+67y+rz9xBf/3Py7N2//tTfuXP/aVrtFaQI2RlrGYq0iqkioHKNhn35/QFWNqKuaw1HFaFgz8oHdazdotUu+94tfZGdrl7t37/Dqyy9yfWeHXq/HYOR4vPcAVznapYUYcPUIg8mTioGqyktLuRAZjmoq5xnGxKh2RyMxnHN5Xca5vaqnw9N68T9o1fgm2ngcR34gplI8GWg/ToBolDY3teG3vHffOI9zv8J+G/3ZE/98fTO187JK9YKfVy3HHSO++Ofif+Xtt//oF1+6858UCbXbKQjDihRqdnd6lK0WIQYG/QP6/T6+rnA+3wN7vHfI44MBg6pmvz9ib9DHasNOr0e33cP5ips3bqJtSbu0RO/o9/tEV1OWBUbB4eEhSSl8SNTOU0fwMTKqPcOqZugjB/1DBoMB3ue1FieXCX0IR0lqOnnFOT2u2eH2+ecniezJfxxty38aFIoQ4rYP1S+d9bmfKo387Il//v68icyLDpx+bdl1z3ngOkGLL/6p/e//ylf+wBu72/9bm2gLnbApUhhFr9vh5q0bdFsttna7aCKDwz6PH+/z+OE++/0+j/b77PeHfOejTxhWnscHh3z0yX0Ggz5K5YdfFlqTUuTa9jbtlqHqDxhVQ1rWoDU4l5NSioqoNUobktJUrmY0GvFwWD2ZwIwi+jyIY7L6fF6PiqPcM0le8+5/Lfp5XplcRiSpyeXEl50f/pWzPPczPzfusyf+xfiLEtikTMZCLermzUKzjZi3/zpFfPFP5P/Au+9++a0Xbv3tN1+4tfXm5z7HW6+/yt1bN3j1cy+z1WqTYhivgjHCFgUkOOz36feHjKrA4XDE3mGepLw3rNg7GDAYDdnudhgNK/r9PkaDNYpWUdAuLYVOkCKJQFIKowoiCmULilZJUbZQhpfXOwAAIABJREFUSTGqRgwGQ/ZdxHtPQuXBFj6Ml5DKz/5K40V+Uc8mL1ieqOaeUDXVY2PyeBZtrVbXfXB/6yzO/YKf126q+OIv8+clsHkHzGvISbLrPEN88c/U/+kf+7H/6kfffOMX333j9c4rr9xhu1OiYmB4eIivRxwc7uNcpChaDEb9o4Vz+/0Rg5HjsKrZH9UMHVy7cZMQNH/qj/0kt65f570PPmZ3u0enVfLZvQdcv9YBXxNDyAv1xpATkQ+gNTGBtRZjLUpbvI8MBoP8n7YM6prhcESMCTt+SKaK4Gs3lWhAJYg8m8SmV994en5YLtM57smlwycJTI8nTceU3vK++oXTnvsVykZ/9sS/WH/ZII7jynGNWLbMyHGZXHzxT+T/yZ/8qX/tz/7hf+bvfe2tN3/g7p1rbPVaVIeH9B8/wLmaUFfU1Yiy1cLYksPDA1rdkroOHBwOqF3EJxhWNZWDre1tXnr5Vb772UO++Tvv8SO///fxx//YH2V/b4979x+QYgB/CDFgFCQfCK4ihABp3HtKmjQeLRgTOFczGIyoqoq9oBjVNSnkEYXECOnpNQ2fKnOWmAKOHVI/e/jTx+YElnthdJSO/20I4dFJzv24NPazJ/7l+KsM4pj3+3Gvz8vM87qD63RNxRf/WP9n/vSf+ds/8bWv/Zu3drZVy2rccB93cIjG4auKFByjakRdOzq9Hj5EqtEIrxWDyhNCoOx22draIiqLKVvcvHOX7tZ1Xv/c6/yBH/0RtLZYDNd2tvjuBx8SlSaMHtG2ltIaUsqXJUmgtCE/q2s8AjAaiCk/rbmqCM7x0IMPfhyBIo2H1FudJz5P96rU+HEqTwU/NRLxuHtgTwZ0PD3QI6Ync8tAEVN4KQT3N9Y991OlkZ898S/PXzaIY/b3VbPpov1mX1vUOPHFX9n/+p/8M//OT/34j/+ru70erRKqwwMOH95HBcfh/h7VcMBgNMjLOPU6GGPpVzW3bt3CtkraZUlQihQhKkhJUbY73LrzAr3ta+zuXsfFvELG/sFjHtx/SCKyf3jA3d12nm81XuXCao21Ns/jUqCNxqgCbcb3tSLUdY33jn0KRlVNNarz4I3x/ikmnHPPDJWfDnx2pfpFr82WpxJYZCqBAcQb3te/sM65nyqN/OyJf7n+7ERmzbOjTKZfi0v2PW6S2rL6xBf/RP5bNzr/YY8alTR17fA+olo9Hj38lFBF9h8fsnu9S0geVIHXie5OB9oFLZ2rKsoSVyUGdUWvKGh5T3z4iLLnUDzG6DzgIgRHGQK3ysDui9fYaUEMgb7z1CHirUEXLZT1pLrCELA2oBOEAOjETighlfQOEkMD3uanMseUnyUWgaQhqfx9PXrASpr8A1fNvWw4O1dMjR9umVLEGPNML81agPFq+Uqh0LfXPfdTpZGfPfEv159NYPPwdWZeLyqL9p99XXzx1/avtbu9x48eU1UjHt3/jALodVu0yy79qsJYS1UFultdjNa0TInXeZJxd6uLUvlChPeBctjG9SIai7YFZbt1dJ/IhUBI+XJjNb53Vai8/FSnGjGoPMkajDF4b6hiwIQ0fmpsIk9pBm0V1hhScoQwHok4Xu5JKYWxGp1yT2xSphNWnqD87ICN6fKkJ5YT3myZPS5k27RarTerqvrWqud+hbLRnz3xL9eft5TUceh0xXrmz+PKbEMnxyw6TnzxV/b3+33sp5/y6NE+w+EhlsT2Vpc713fZvr5FGA7Z33tEINE/HKF1m62bu5StDq1SY3SZh6r7RKEdtYsYXWKtQRfF0WW3IgZC1HhXo1VBrGqs1hS2g20VdALoIvd0+oMBKYww0UD0JJfAB5KDFBPKQFmWFNaitSbEnNzys7xyj2y2x6ThqYnMs72wydJSx11KfDoRPpv8QtI/Dfz8qud+yfsEG/7ZE/9y/VXvgR23zyr7Lrt+Kr74J/avd3s/Ww2rzrd++7f5R7/+T/jwg4/wdc3u1jbbvR47O1sQE3XlGNUObQtu3r5LoVsoG7G2pCjK/Jd6BJUUSicUhjTd00meGCIpOmL0eS6ZG6JSXpDXWEPZLiltSVSe4BwqBFQM+OBwribGSIiJEAIHsWA0GlE7R5jubUWOElGamf81e2Lm3euaTWjTr80muOm6836pCsH9D6ue+yX7wYZ/9sS/XH/ZROZlZbZxs79Pg3rmz7Mo4oufdra3/4SFlw/2D2mVbYb1iPfe/4BHDx5y7VqPdqtFy5bs7R1QuUhw8NKLL1MULZSJaKXQyYwHXhiMshilsUajVEKTMApUShiVMJY8iVmBSo6YEqHO6xtGH4gx4L0DH/H1gOgqnAt450lJEUh47/mk7zk47DOsKkjkQRtKobSGxFOrzgPPLCO1qHc12Wa0nnuilVLPjGA8SmoKgq//i1XP/TG/HzWLDf7siX+5/rJLiNPduXldu2W/z9u2yvVT8cVf2dcxvP7g0UO63S6vv/oqpYZv/cZv8s3f+i2qUZ8fePfLfPELrxNTHgE4qoeEkOhtd6iJJBcJOhKDQmPRRf6nXYopLxdFIo17TTEklDLEGIg6JwIVHAlP8okqhKNnb5EclvGgjOAI3hOCZ+BqDgcVh31FVdV4HyaTiYGnH1B5FOhTPbH1V+CYHDtZ4HdSZi9TpqjuzDnfV/a9F7/Z/mwPbJIh53UR52XOeRl1lWy7aJv44q/lf+Wtt7746u72X/zs8UOsMewf7HP71k3eeectVIr89nvvURpDy2qq2lE7T4iJWzdv0W73SAUQDQmNUhpsgTKWqAxoS6vTw9gSUxiUMegiTwCOMZBixI8OCC7mhKU0eSX6CoJHE4l+RAwe5yPOB0aVZ3845NHjfR5U0B8N8c4/We8wRGKEGOPR4BF4enbodIKbN/9r8qdecJ/rqHc2Z1kqpbDeV//xKud+zuuN+uyJf/m+mXlhOuOlOT/P/q7m7DfdgEUBLWqQ+OKv5f/QO2/+/R/+2u/ZTTFSFIYbuzuM6opOu8W773yRd978Hrpty4NHj3m495gYEr1Oj2s3b9Jud3DaEI1GGYu2JdpaTFFiiwJjLSHG8VqEoHQOJRGJIUGAFEeEkJ/YHEK+x+brGqUT3ZalP+iTao8LER8izkcGVc1hv8/DWjGqqrzyvFJTUWkUCm30U52teUtIwbNJbPLfor9BlFIYY555BhmAVlobw3/jvd9bdu7nvEeN+uyJf/m+nTp4drTIvJ+P2zZvVMoqXUfxxT+R/wd/3w//R3/oa1/+3M72Dm99/jVarS4hRt54/TVG/QM+++RjPvzu+wwGh4wOh4zqmk7LcevOLVShcMGBsSilsUWJ1iWYhFI2D3YAdEq4eogPkVS7/LrW1C7hY0J5T3IBXzmqqqIOeQ3D6BX7+xU6JIZVjQ/x6L7TYDDg4d4BAxLe59GHSmusNXgfiOMzGUNE6dyL8mG83yQ5Td0fm01m0yt4TLYfPRtsfNkzjZ8UHVNCK3X0+JaYEt7714D3jjv3c35u1GdP/Kvh2zk7zTZkETpv37hgv+OK+OKfyH/1xvbPWTSf3r/Htd4WQYO1XSo/wrYLbMvwwku32X/cYt/u0fae3Z0dbty5QW+nS6vbYqQK0IaAIZm8wG1eUT7f93I+jxBMKeBDJCSPceDHl/rccMhgVON9TiJHyWU8r6uuayDfPzscOR71BxwOK3zKT1221hBDnLrc9+QemNIz96cWJK3ZhXznjV6cV0KMuc7xhGeI4/t35svg/85x537O+9Soz574V8OfN4hjUQXHZcvJtmlglQDmNVh88Zf6P/LVr/6l73nlJfXBe+9jtGbnjV3uP7jPYTWk/80+d+7cYGery/Xbt3jhhdt55F0yFK2SVquDtQURjzI9UlLEpPJlQdJ44V0/Thgxr29IwDmHq2tiitTDETFGUoIqePz40Scp6bxix3hel3MJlxQpauq6Zv9wwP6gpgoJpRVa6aM70SHE8TB9dZS8Zoe8T8psYlo0v2vS+5rdN07+jAmtySvpJz3Z4/Xjzv3M+9S4z574V8e3c3ZahKyybTaQRfXOa7D44q/s37157d97/8MPeXWry+71mwwGA0b9CqXywksff3If88Jt6Aba13co2y1wCUy+5xVUQqlEjB6VDEF58MC45+VjIsaAwuNrTwp5cIZ3HmLMPauQMCniq0AVHFoXR72kFHNvJoSU74+hwFi0tgSjCUnlUY3j7BJTJMU0/v3ppKW0QkdFWKFXNZvIjtl1vN/cWtrHnfsF2xrz2RP/6vjTCWwedFwmnbftuKy6LDjxxV/J/8IXvrCzUxa7vbJN27bZ6Wzx2eNHdMoO29e2uU1ib/8h/WpEp9cClW/1OhyFsdjSonRBTBoVAolISuEIjDH3umJKBF9TVVVey9B5TAJFGneaIrVP1DFQx0CpbB5zETVg8D7ifF56KqiCpA1RWQKWoHNPbXZuV34is3qmJzVbpofDPz0q8Uk9iw5fngDVZ4vO/bg09rMn/tXy5/XA5nUJZ9FF29Zp5KKsKr74x/q7vc7PjqqKwlg++ugeg/0RNQndKkkadFGws3ODg8PH7B8M6PV6FL0ONhmCgspFYqwJKdDrWSa9LvJPpBhJ1ASfiLj8nK/kyUsZ6vzYE+eIPhBCQCmDGSeOENV4ZY2a4Dwhqpy4QmQ0qtjvjxiORoyqgD9mFY15ry9a/1ApFiarRXO+Jj3FyXD96YEeUfFrC96b2Z+nf2/EZ0/8q+Ufdw9sUtHk53UaNH38cZl0XhFf/GN93x/+KW5e595n97hRa/Ye9YmFxtgWre0OnZ0e12/u0mlvUdUHDCtHxzuM0jjvwRi2dnaxtkMY9ok+oorJRKwIKRK9I8aIIkDyKJXnenkXCLWjf3iIihFv8t/6yhqih9GwwtU1wQdiCBiTk0XlI0MXqUOgDlAFSHomEenpR53kcBctFaXU8iQ2/Qyw6fJkgMdsneN9Q/3Li849Df/siX+1fDuz46IK4dksyMzvy46fLsfVJb74x/q3d7e+vLe/z97eHmFoKFotQtLEckjqH9Du97i/95CvfOVt2p0bpOQZDoa02i1irYkdhY+R6Gq08iidGI+5IJEIwROjJwZPdIEQHBZFih5Xe1xVE+r8DK/ajYgpEZWh9o66zvO6rNIYa/FuhCPf71JGU3ZadGuHj4pRiE+tOD8pkxGM2uinXn+yWsf8Mq/zNm9dxPnHHi0vdQg8nNl8Zd578cWf3r5oGP1xDZi3bd2MO72/+OKv7H/5zTf/jeu2UP2HA+7oLb5w5xbWtgga9kY1n+ztsf/4gM5Om2/U3+Lzb75O7Sv2B46dHU1ZlkQfaQdDd7tLPQq5JxQjwQecrwnB4Uc+3xtznkIb6nrIsKpQJFKZ0Jh8n+wgrxwfQkUKHkVAExhET4yRUdS46PHeMIp+PCQ/oVOgMIkq1JS6RYyBFi2CS3TKghjIibCwuBAYek9U5EEoajyhuqoBCCphjB2v4hGxpiCRUIwnM4+TmCFPXlZHA0fqcYLL991SiqTov7HCe7fovVylPLefPfGvnr9sGP10w+ZVumz7cY1btL/44i+s/5Ub1/7y7vYOr964w5e++DbFwGFUgVOKw0HFzQef8eH9z/h0/zEffPgRwzDg5u1rvNC9ky8fqph7YiZRVdV4OYF8LyiR51BpZTBFzPfAUkKP50tplYe3hxDw3lONRqSUCDHmgRohEGLAhUAaL6HhnMPFRF3lHp01mqIo0KbG4OmUJbYwqGAprKVlWpS2Te0cw9GI6AJaJdqtghgTPkWcr/HeY3QBTC4fJpTSeUg8efj/5DlnjB/RMh7pf7S4x2RitXr6Rtl/vuJ727jPnvhXz182jD4u2LYo4x633ypBii/+Qv/dd7/0h7/wyt0bO0WbV+/chejRvRJjChSGrW6Ll3YKihtdWp92+OjBPfp+yDW1i7KgLSQd81D76KhiolCe4APBeVKMxBgIMeKdz6vHE4gJdMpLPXnv8c7hnaOqHXFUE2Kgrmqc97hxz8uP71HVLlGHxHDkCCmiI1g0JgEq0SothdW0em20Vuy0e6SgGVSB0rQZDIckrbHGMKwqRnWgbQ2qsBxU4wnQMZBSwBhDAnwMTwZ8MLnfFSf9MSJm7vyylJKv6+F/fxXfe/HFn/f7omH0swfNbpv3+rwyrxGLToD44h/rv3rr+n9dFBqj4NGjR6gQKFotOq0OttOlKNtsb1+j+8J1rr90mxcPX+KwOqAwUJaWVrugLIu82nzyaKuJLo6TUkUYL+sUxwksep/nio1H7AXvGQ4G1HWd10gcl6MRjDMTiCOKECIhRBJPFvQNyWG0pltoyrKgKApubF2j023x0u27WGshRFqdLq2ypLe9hXeezz69z/2HD/ndD9/nN373Qyi7uYdIfkQL5F5V8h4986g/pfRRAktp0mPjqXanFL696NxPvS/zXp9XNuqzJ/7V9Bf1wFat8LhGTW+bPX7eMeKLv9D/8pc//+qLu91XdPIMR577+/folC12bl2n3OrQ3W5TtHuoVkFZGFJLo7twt/UC+4M9VArYjqW0BqPys7+0TqQQic7hXZ6vZVB5DcRJw2OkHtWEEHLiqh2EcW8mxDwBOSWCSkSVcCniUySEfBkvxnEPTmtSyqt54APdluX6Thut8hOZtzuGre0Od29fY3tnm5ZpoZVmb3+fBx99zAcffUw9GnLz+jW++tpr3O30+OX3Pqaq6/HK8gqVcrt1Ajt+pIti6hLhUY/rydOfn/6Tv3AV33vxxV/kL5vIPP36okw63ajZOtapU3zxF+778o1bv7jT65BqR6ddYFKPUEeiUVAW0CmgpfGkPATeRGy7jTLQ7XbQOlAajdaGQhuU1sTa41yND57g8qU/tM73iCYDHVxgNBzmxENORHo8Cdk7hwseH/M9sRDy/S9fB1wKxJAbn9KTIepKQassabdalMZTlgXGGJRJRB8YDg5QybPvEh998ikfvPcB9+4/gBAJzvNRUfLy7du8cOsmN7a38zbAap1X6nhqvtiz88DmLUGV10OMvxN89X+s8D417rMn/tX1Fz3Q8rjK1t02XY7L2OKLP7e8/vrr7ddu7fxEpzR0Oh2s1tRG0e1uM2wVmFYJhSUaRYoAFltoTKug3z/ISSdnJVSIKCKp9tRVTRyOCNGTos+DHWIeqp6Hzwf8eMDGZMJvHC8RlYNOeTX78fNWYoj5mWAmr2cYQl4HMfhcT/KRli0orKXdaoGv6ZUlvW6XqnaoWHNw0GfQH/Dg/kN+4ze/zcFhnxeuXePtL76JToqPvvsRVf+Q0Onw4o2bPLz/GBcC1hhiGj9dGiDGOZcInx1GPx6FGL1TP3HMW9DYz574V9ufl8AWZbvJ9cd52fa4Bi7K2IsaJr74T/kv3dj9+m6vrUptUSphraa1u0O3bJPaLVSnAK1JSROTyvO4vCelSKkLXKhQKYLOgxnqusqPKKkcVpMT13gm8GR1iskSUDB+1EkeQI8LeZFfozTWWLyriXE8yZk8FL/yEELCE4lR4byndo4YFa0i3/MyxnB95zrXtncpyoKP7t2jqvNjV5KHD977kFu7u7x29y53b9zklRdfZKfX4/XbL/DxRx+xf3DI7q2befh7eJKg9LgHNulNzpv6dTRheVxCSv8jjL5zFd978cU/zrdzdp7eYRpdlj0XbZ99fZVAxRf/yN/p2J/b6vXAeRKGTquFcwFVGIp2G1u2MdaSIuPh8BqrS7SKjKo+Jj/jCu8DBp0xH/BVwBkPQPKRME5EKaWjYfGMF+adJDNtDIPhiHo8kXk0HtIek6L2eYWNqBJ18CRtQOcBFklDu7C02wWdosSHQFl2ePHll9l7vMf+/iDXN3K8/8F3+Z4XX+bdL71Nt9Vit7fL9e42e/t7GFvyxuuf53B/n34IoCOWPIm63W5T1XV+rLIxuPFoRKX0UWIG0NqMe5MBVLoX3OjrV/W9F1/843w7tfOyShdlx1XLcceIL/7cfb/0pS9de+e1V75QD/Kahlu9Hu1eF+sSRatgq7uTny4ccnIpSwsxEUJFqB0pRJSLkAIq5tXng/NUVcA7hy7GvZbEUfKC8eW28V/6k7/8QwjU457ZpNc1mUvlYqJ2nirUxKipIxgSg9GQXqeDDwZCIvlI3w25cW2HdrvHo0eP+Ojje3z26BHWWnTMvaNP7t/nR7e2uXvrFjoZog/UwxFhvMrH1tYW4eHDo4nIs8+5fWqU5NQK9ZPfxzF5Z+LvP+Z9avRnT/yr72vmlzhn+zoB6Dk/rxO0+OID6FdvX/tPO2VBu9Xm2u4unU4HbS29nS5bOzt5yHlKxBDyPaiYh7u7yo1H6BkCoGKCmEcOuio/1yvVnhAcIXp88oQUiEQCIf8/Bdz4/lcIgVFVU1f1UQJz3lO5xMgl6uCoQp1Xpw+ekfeMfKQOiVFVH62SkRJ02i3atmRYB37zOx/y7e98SDXybLd69MoONzu7HD7u82v/6BuM+vly54P7D7h37yHDymHaba5dv8nBYEBICU8g6khQgaQiMa8hAkySVSSlCDw9dD4l/+8zGn1n0blf8FpjPnviX31/1UEcx127nBfUbFfwtEX8hvo3eq2vG2PobfdIwKiqMIButaDVQjtFUgatC5Qu8srxPi+xVJYFVkWiSbg6EH0keo9zLq+KoS0++ieDGya9r/jkEqJ3eXs9Ps57f3SJ0XvP0IW8+jyJEFS+DBnyMPoQHJ12m0H/gFLb3FOMgY4t+PiTe/zOx/dQPtLtlFzb3qZbtii1oXuzzRsv3mU4qBgc9sEFHj18iAsjWq0dylaLgXd8urdPHZ/cp4sh5rUSZ9ZEnDyl+an7XtH9v97Xf3WFt6Cxnz3xr76/bBDHogOn9ztJI4/L5OKLHwF++Gu/9+dudDulLUqccxzs72PbbbYLQ+U9aVCB1vl5XyqCCsToyPOcIlqPRwB6T+UcKThC7Y96VUklQu2OLgNOLhdO3wOrQyClhHOOKrijJy37lPtpLgV8ivgIdfC4EInkh09OBktYa9Hk1TS0NvSrQz57fB8ToWiVXN/ZZrvdoVe2uLW7iwVeuHOLw70DttolEOkPhoQQUTpRlAWfPnjAp48f4lPEGE0aT2aOJNR4EeDc65rk5YQdPygzxTjwbvRDS96XRn/2xH8+/GWDOI4rxzVidvtso4/L5OKLD8DdGzt/qSxLgnf0K8fBaMBOYTgcVFSxoNNRtDoWFS3OO7QypBjxKa87WNeRFCqqekQda1TKFwghwnjicQxP7nvNJrA6eOqRI5GO5nlNLh+GEHA+5BXiY8T5SO0cdUhH862UUuwfHrLbaeOdp9Npc3Nnh8HhPt/7+TdIscA7T6kSpbHc3rnGay+9RP9gn+12F+sTbWN5fHjI4f4eWztb3Lh1A4/nn3zrWxwe9o9OmFKKGOJ4GnYuefDGk2H/kxVDgko/s+zcLykb/9kT//nwVxnEMe/3414/rhHT+6/TNRW/Yf7bb7/9zrWdTnc4HBHqik5pSCnR7w8YDB3t7chgNGAntonJYpTBJ4WK49GEtSdER+2GKO/GD6RMKJUXuVVakfLIDZJSJE9e03CyskYM+OCpossTnX2+f5UX050Mi4/4YKhqTx3y/TI/TmA+JLTWVFWNK/N9uhvXtnjpzm0O9lq8cvcuL959CR8jYVRz8PgxqnZ0WwXdchdVB7ZvXMONhrz/nd9Ba8ULt2/RLlv8+m/+Fr/8j7+BL0q0NeNlpPJIR1Do8bPLlLIo9aQ3llJCEf96cKO/fsz7denvvfjir+ovuge2qGGrZtNF+82+tqhx4jfcb5X2z3sX0CEwGtborQ51cOwfjkil4Zo2jLxjMCooiw5aaZwLVHUezJGiy/eEqMaPL8kraVhtaJUlpWk9eShkSnmldx/ypcFxT8s5T4hhPBF50kvLvTHnXE6oo5qqqvMcsBAIMfeGvM9D2MuyoHaOrVaHazu7bPe6ML4s+elnn+FHNYPBkL2Hj9gyhnbS3H3hFnvDRxil+OSTe3z43Y/44ve+Rbvd5hvf/Aa//A9+lS4RbfJlyTCem5ZSeupyqDHTIw8hEf5+7ep/YcF7eWXee/HFX9WfTWDzKl2ULY/LwKtm4mXZV/yG+u2y3HqwX6GpKYqCehTyqvNFhAQPHz1Aa82wX1AWVf6LfGoCsneemCIF48eLqIDRhnZbMfQVReFptdu0HTjvGfo8unByCc5VUNUxL8+EwUdPXdd4n0hJ44JhNKrYTxCNIXgIpsDr8WhDAyYlbNKUqmB0MOJaa5dts4UpE72yR2kq6hDoDw9o+YrhKPKwtBzs7RFD5Duf3KNsdXj93a+itrf5u++9z69845s8dJ7e1ja4hHMRlRRqfH9rckZNMuiYiDGMl4pKvxV9PX3f68q+9+KLv6o/m8BWyYiLsOPKqt1Q8cUH4N79h39jt9f9l1KI+DDCVSMAUsr3nazNo/pCHGGNyfepXB6gMV1apiCR/xIvWwZtNGa8ULvRnv54DUTvPXXtiDERoxo/3NLj05Mh866ORyvTV3WdV87QmhAgRJ//TD4/NDImVASvQl61Q2tarYLrN2/Q6nQokqKKkbJtuH4tUnd7hKqmW3YZ1TWD2vPiiy9SbvV4dNjn7/7qN/jmhx/gtaEsS/b7Q3TROopz9snLR6txAEqlXwu++r7x+V567pe8tvGfPfGfH3/RJcRljYxT+6wS0GxDJ8csOk78hvvf+c53/maK8X/a6bZ+ulMWypjxhNzocc7ntQVTotPtHf2lHWIghDwqr6UtRhuGtgKV/0JvxwK0xRjQOKo6oOpwNGijqmucc+QFOMaTfRWEEPO2OqL05EGVkZELefh8VHgS3j2Zf8VkfUSVqGrHwbDig4/vsdvbodNqERXEYAhKQ9lCKwuqJJVtwEAwPBwc8t633+N3P73H49GIgAZlCWhs0T6yppPXdMmJLP1d76sfXefcL3k/N/6zJ/7z46tjdjzLsm7WFl98AO7cufXsEkwUAAAgAElEQVTnS6v/ojXmde8q5bzHxLweotV5AV+lLFrnS31KRYwuKEtDSUFhQZu8dFJZGjrtNpAHNBTawPgRKj5FfO2pgyc6SOMFebWBGKAKnlB7vEqYCHUKhMozjJoUFS49SaoA2iRsIs//UpG9B3u8eOsmr7/0Irdv3GSr3clLTnnH4PCQfn9A7RwkhXM+Lyn16T0OhhUVCWtLagVViAQ1fr7XnG/v9EoiKYX/LoT6z5703J9ReW4/e+Jfff+0CWy2ccc1dp2sLb74T5VOp/NyWdp/2yr1p7Tm1Ri9iiFP4FU6JzClDFqDxVKUGqMKjIWiKNFaY02isBbGT00urEVF0AmiguTCOEEpHJMBGQlQhJgI3uFjXhsxpgRBUQcFGOqU64zjBXW1TpRa07YlvbblcP+QYX9IkWBnp0ev06FKET9+zthwVI8nP+dJ06MQ8wrzWJRV1ClSeQcqPxLGp0QxdUHw2RXn/V/z3v1bZ3HuF5TGfPbEv7r+ogQ2D7zITC6++Av9Ttn5502hfq5ly+9DY+P/z96bBkuSXfd9v3Puzcyqektvs2Iwg8EyAAiAWEgsg0UQKFPiJsoSpbBkhSWHFVq+WKEIO+RwOGz5m62wFWE5wgtlORx0BBUyZVlctFAUSQEiKIIgVg7BASGsAwxm6+6Z7tf9Xi2Z9x5/uJlV+bKz6r033TPo7penI+NV5V3+N7Oy61/n3LNEWwbtJs3E4b3gEFSEPMuSd57Gem8oeRAWdRy/M0fUiEYlasSZI0jteWgBVQ9EYoSyWhAjBBW8QVVlKdAZq8kj4lTJvJA7xyTP2B2PiGXg8osvceXKSwAU6lg4l+LKBKoAPsswU8QpIYLLM65cv4YBeV7UmTwiFS7lb4yL5Q1rTJ7pdfxfQpj/9Vfi3r8KMuAP+MfG7xLYSRfa1/84bLuubcAf8I+Nn2XZe7K8+PtO3XsAVZHagUJRZ8svfJ95LBpGhVMHVpdEqb05fIfAMjyVBEIlqIuIpYKTRCVSEYNgKklzW1i9L2ZYBHFJsxvlDu89u1sjxj4nV8fVK3tcunSR6XRGZYYWW2nPTYRZKHFZRgjgMk8wYTaf4vMxRZGzWFSUixnqUkHOEAKqh5PzApiE/yuUi7/ySt/7Nf1PzbM34N8e+G7NBMoqv3X7dfe99PRr3lvrXHeOnipFA/6AfzL8GOMLZbn4e2ZcjmbvV9WJiEueghEwScmVLHkoViFiFmpzYJXKpFRGFY0YYFGVVFWkXOYyTFWVQ4iEOhlvlLo8ihnBIimJk4CkuCvnXNK+8pzCO3bHY8ajnO3JGOdS0t9Ylcnl3ywFPLsUWJ3nOaUZQYVg4PIcA6oYEUvhAF4cIqB1fbK2GPHjoVr86Vfj3nPKn70B//bAl87gm5WXM9eAP+DfNH6WZY+HKP9oa7z1cJZnlIvkVAFpT8rXGSnQmFIqSZNiKZ1v0iy1pfE4TIlw+/7fwUghmqBiZN7hnCPPHJPRiHGRcWF3izx3EA0lpZu6cvklnn3hIqWNKA3KGImSMmosIiws/YiNRjKNtqpSOkuZNghCaNlPTOy5ajF98IS37a747Af804vvuJERu6zXB7qOIdex5SYZ8Af8m8aPMT6tPrviRH9CXUpHIVA7VOiyUnHjUr8sKxI3oNW/KZN5zpZ/wVYu6yHgvVDkGUXuyTPPKPdsjUfsTkbsbuV4pzgM54RJ7vBeyXMlkJNpvV+nDjJd1vcyEczC8hI1gljEacpbDEaquGyYxYNQzd4ETI95D9tXuO7e9slt+dkP+KcX3/V0WjdBV01s9+1TF49zAX0LHvAH/JeFb7F6QtX9Refc+bS/lZpF5RCBQfIuFAGzzY64Rjjkrp6UoZWDyDgXxkXO1mTEeFwwzjOKwjMZj9gaZWxN8tTXAs4JXgSnglPF8KgTEEW84gVMINakajEiFlMtMww0Jn2x7mDi6hVVPxpj/Aqn+LMf8E8nvu90WrcpxzHb+jbwNqmJR/Ub8Af8E+Eb8TMW7Y3ia/Of1sTVevTbAb+yJhRy1efG/1MOxTlFVRmPPKOiYDzJGWUFqjB2ymiUUWQ5Xh0qgRAdMVakYpMVjkCee0IQSoVYGVGSZ6MSELsRVw0Mg6UWBoL9TFlVH19zD0/VZz/gnz78NoH1AW2yT/a19S0krmnrvh/wB/ybxhexnzXCnzXzYtFwCKKsvvEttDorfQqYqiy7o80e2Go/zDtHnmXkoniX0loVLmec54wKz6j+68WRSwARNEYqA1tEpCoRCynH41wPEWqTqooQURNi1EbtO3zzBIJV3wjl/C+tVnq6P/sB//Th92lg3b99oOvaTrLIdaw64A/4Lxt/Pp//uvfFgcVqS1QO1cdqi4jW2ln3fDrhmgYFp0nbcqo45/DOM84yiiwDAkVRMClyJuMx2+Oc0ajAJ8dE1IwYAk4Sd4ZloHNKvJvMm8nLkCogwdCoaX3WvU2ry46AWPjL3Eb3fsAf8F9t/L5ciLH1V1uvT7Kg9vi+tk0y4A/4N4M/izE8Y1Ee884tA5wbEVG0IQ0BorbaZOmd2FgWM1Iaqsw35KVkWca4KCiKDKcZRZ4zGeWMRiMmWcoCggVinWcxxpiyd8Tkjl+WkVAas1CyCCHVBAupHEtVF9j0KAGri1IaJikvI019rxh+N65Mh3338DR+9gP+KcPX1rFuIW3m646jp61vQV3pm2vAH/BvCX4k/n6IcVkbqzEBSqP5yOFzXROhts2F3pNnGZn3ZN7jfEbu3TIbfpZlFEXBaDRiNCooRgW5Fql/44YfDAsK0ahCoKwz2c9mc2bzOWVZUlW1239F7e2Y1q5GbeZs3Caluca/1nftnXvXJ3f1Zz/gny583zO4zXzrpI+FT8K47f4D/oB/S/HF5Aky9ydnsSJzgBhekhlQgWiGt7SXVTbOEh58nfS3yWohIogDcYLXmrCcpEwbmaPIM7JCGY0URuDGQkSZlQF1huYCZSBSUlaRRRQW5jmwglkFe3OlDHA9wtwiQRzBQ4wVFipMAzEEvKX0VKWl0i2o/R5V+enb8d4P+AP+q4m/yYTYTBh7zh+3fdPi1vUf8Af8m8SXb4kILoJZcobApSBgcUoWbVnN2Lm0LHOrasbLjPKqeAWfeQrn8d7jVckzT5ZlZD4jzzOyzIMqHsU7TzQhc1DVlZJjjMSYcisuyor5PGlgzo2ogiBEjIoYwGJdGsZsacaMCGZKKp8iqNp/dPve+wF/wH/18I9yo49r2tYx7qZ+x7nIAX/Av2l8EbnqUVCj8dJQBe8FVYc3cE7IVDHxhzUuCZgJUQV1ilrACzgvOK9kTvBeyNRwEslEE0ykNQ9YNGKVimGGSgghsigrZvNkNrw+K5kSKOvUVW1v/SB1eOZy+avGSHyyWiye4EbTzW1x7wf8Af/VxF/nRt8d1G3rO98nfYtYdwMG/AH/luBnonOtY79EBI8yyjwjl4pcKoLzkIsS6szvZqHe/0rkISL4TAiVI8scWZZTOME5R+FSyihZkmPyGFQTxGyZKSMV2YyEUBFCIITAogxMy+SwMavmmCkaDTWPOk1UFY0gSRsThcYPxaKEGOXHN117z705VZ/9gH+68NdpYMedcNOi2m3d8X1jBvwB/5bgO2dXM+cIFnEqZOIo1JG7DJ+Bi4l0PIr3qdYXOJxqy9nD4RxIDr522hj5RGBe0+G8Qx2MMsW5ZE704omklE9YxcxStea5RRZVRVXVZIZSOCEEwzR5HBJJlZ1jeh1RxIwmaa9R/UNYPHU73/sBf8B/NfGPCmRun1/HpO1Fdec4yZwD/oB/S/AruLTtPT7EVFjSOTJRCqf4Og+iiqIuucabpqnE+9pLMS5jvwByRwpYVodTR+Y8Ple8ZqhTcudxWU6RZahk4Kq0sDJP9btCSFnuG+3LUr5DjRAALBICVBFiTCQa1WNWpZRSYmiwiyEs/sLtfu8H/AH/1cTvc+JYJ+tAjmpryybGHvAH/FuCn+f5tVHmiC7tVXkUnyuqaQF+GdPlwCWXdRVBvKCidb5EQ5qYME25E1UN58B7KLzivaJk5OoQURwJI1ra85ovShZlyXweKMsyucuHlAlE1EM1RUkFONUJDqWKiWBT4U1tsnCYIX/jZdyXtpyKz37AP134fQS2ju0a+2Mf225a4DrGXrewAX/Avyn8EMJ+5n3KFK+SnDAgEZlKHZjs8d4RqQlFBCeKacRsyRvkmcPXGTgyTfthoyInz3O890CKFaOVFtvMCIuScn7AYrGgrBbMFiXzmKovmxMcDikyfHSJwHBMSyEQmYcSiyFV/BIghE/FsPi5Y96z7+m9H/AH/FcT3/d0bndogx7Fnuvau+ePc6ED/oD/svGvXLly5cKZHTs7mkiugneGxQjR8F7IM48zIywWZKPaacPXaaXqvL9CihMbjYtlfFiuDpcJmQpODEckz0Y4FUyUWC0IluLIyrggxrSkKiTtK4RI5hwqSmVCLhOiCQfTOeY80ZLWprkSKkOdUC3mJRL/5hHXf9vc+wF/wH818dvM1ne+3aZr2o8rm8YM+AP+LcUfoaHwSpHp0vOw2dOqQqgrLKfUTSEa0VKNL6eK15SsN8syXK2x+WbPrJ7H1YcYtaYU6niviFXJ47CsKhaLtB+WCl16ssyT+zR3ZUJeFOBXrvzRKigDxDJl8xD9GlX12ye59h45VZ/9gH968NdN3DewT7VbJ32AR40Z8Af8W4YfVF7M8xwRIcRELmZWu7NXLGyRgpedoS7ixfCaiMZ7T5Z7iiJD6tyDzlHvhSUvxaa/SDNvRaQiVHPKMGexmFOWC6KVmKUgaedcnY7K4Z2wvbPDpesHiGYcLEoqjCzLmIxSfsW62uaVk157z+tT9dkP+KcH/7hs2jfZpjm6quDNyoA/4J8Ivwrxi5l3h7LNN7kQRVIWjjzPk1ZU5zXU2vNQ9XCJk6YYZvdI/SJQYbEihIqyKpkv5lSzBYvFAqs1u8xDUWTkRc6ocGSZ59rCyPMxlUEUz5mdM/zQBz/AeDRi5CSVXSFeOOm1b+j/cuSO++wH/NODf5QTR59tstvv5SxyE5MP+AP+TeNfXxz87RjjH/N1ZWZxLMkJIMs8RZ4jdX0wrfM2WV2PS2IqMOkcSENsTnGiKxd7kdrV3TCJBItUNYlVcUGwEohkXlH1SFYQcJQhYBaI6oheyZ3x6D07vPdd7+TK1avkQL5VcKDGwbR6iJKzwJXjXvsRctd/9gP+6cE/yoljk2xaRLe9u+g+Jh/wB/xbhv/cc5c+/sDu2erCVuHT3pZLWeZlNSzGSJ37ghhBNabsFyIpnZRZivGqqy83nojJqSPlhw8xghjRAoYRQyTUKaSabPapjlgG4piHyKIunaKjbbIYuXD2LG965LWoKk8++Qec2ZlQlTO8gkrcilb+ofk8/NPjXjun/LMf8E8PfuP8261frp1z3febzlvPOanPtfu3Xw/4A/4tx/c+e3NOfCekjPJISs0kmv5GIr7e41qaBmvzobrkhVjkBVon/XXOkdemxkRaRmULMCFKIsFQRaqyIoYSLJLnjkkxwrmMEFOWDRMldxnzYpe3veUtnD17jtFoxCd/69Nsj3PO7U6Yzg6YZDkeKI0PzWaLv3sn3fsBf8B/NfBdT0PfpH3Am8DX9eueW7e4AX/Av2l8zbKPZ7H6L50qWeZqTUjr1FDJbd6LHt7Tqr0Om8rLWeZT1o7GG7EmOLPkaRisQsSICNGSy3yoIhaTaXJUZBQ+x5kjSEBRismE3Z1ddl/7Bu65cIHtyZgvPfkku9tbTApPKBds5xnOK4JQFP5stEyms+kn7pR7P+AP+K8GfrfeelfdW3du0/mjZNO4AX/Av6X4r73vnqcvjCcP7e6MGPmMzKVHPlMj8x6t48C0TtTbSCaGzzJGXsmLDO+TpkY0EiEmkosHU4LBDCjNExGm84qqLNEIuQozC5gbs195Zm7C1vn7MDfiT3z/Gb7x9a/xnW8/TZwvQCNhUVGWJfMyMguReQkHpXDx+nR6ae/qAy+++OLeca/9hPfsrvvsB/y7H7+rgR2HEY9ayLrFNfMIx2f1AX/Avyn8ra3Ra7dG4w96ARUh90qRZ+ReybIMnCxNhm3vQ1enc/IqtcbmVrFfIkCK+RKEgFGZoZIRgoFF8ixnESrOnDvLbBGpcIx3z3D2wgUunLuXB+6/h0tf+yJ7e9cAIcs9agqiqPM1mXpwefLhlyy7ur//joPpwc8d99p77vGp+uwH/Lsff50JcZ161554ncq4rn/f2HXjBvwB/5bgj8Zb39wtir9OrPDqGBcZo9GIrM6FaI6akJJ7vaqk4OUm3qvwiHNkbuV5iAgWoQqGOMfBfE45C0zGBQZUsznOexDFFdvkW2cwzbj/oYe5cO48TiNf+fKXmTBHceR5gfo0b5bnOD8iqAdXcHFvj6995zm++8KLLKJ7i8uLH6kWOz8HB4vb/d4P+AP+K43fNSG+UvJyVc4Bf8C/aXnrIw+V48L5c1vb7EwKJsWIGCscBrku+znncLUmpkQUYTTJUOfIlaV2JiJITLW+KsmoZnOUuDRBVlVgHgTNc2T7PGcvPMDO7jne+Nib+fTvfIrLFy9z5swu53XKfDajCgGVlErq4GDKs89d4jsvXOS7L1xmXhkBBc0I6pkHY3EwuxLj/Ico9794jMs/1Z/9gH93458kG32fdBe3brGx1XYrL2jAH/CPxDdxV7fG4wvbkwl5pqhYKqGiyesQknmxcdTQ2hvRgBhScsSFBzAcSUMzCyl3YVmR5yMKr1x98TKjwjMaTdi/NmW7GLF738O8833vBxOuXL6EhZL7zo1xVDiXg5TkeY7LCp5+9nl+9/ef5NsXL2NBWAQjRKkDnQMWjaDgi/FZ1eJzYe7+83K693c3Xfv3+t4P+AP+K4m/jsD6APvAj3rf13acCxjwB/xbhu/z7Pmt7cmFYjJGrEJTtUly5wm1ZqUiy3yEbamqCucdxDqXYl1l2er0VC4bsygXEJMTiIlnXpVkecE9Dz7MI297B889/xzPPvs8+/tXuffCGdx8jhKoFiW75+7hxcuX+eznP8Pvf/PbBPMYGVevT5lsT6gEQgmmgiscXoQQhBBEoxv/T77gkWq+958dcV9P7Wc/4N/d+N09sK598qhNtj575XHso+vaBvwB/5bjnz175pFz2+OPFFmOipF5h3pBXV3Hq/67EknuuSaYGKKp/AmkcifRjGgQDNR59g+mlGXFeHsHcRm4jNe+4TEefctb+e0v/B5f+9ZTPPza13B2a4yXgFDhnSCa8dnPP8Gvf/qzfOu5SyxKOFgYFUIx2uHabIFoQVYUgLJYBMqyQmOkyBzRBNPsg4o8YmHxS7fjvR/wB/xXEt91TrQZz3ped9/3eZW0F7DugtYtaMAf8G85/osvXfnEQw/c97eK3CNAnudEM5L1UFKKKNVaAzOkPpc0M9JrkoZmxPovIMJiOmeUF4hX8mLEIsCZe1/Dez7wOLvnH+Dzv/clXv/oIxSZA4t4C6h3PP3dZ/iFX/43fOVb3+KlvQNCFIJk4DwBx6wyfFYQzSirgCFkPiUaFovM5wtclq4jou9RlbGF8ldvt3s/4A/4ryS+6wHvgnQBN/Vbt9i+RXcXNeAP+K8UfvSZ/8u5112nwqIsiRIp5yUxZXxPCX69q/fEhCiJpFRcClwWw0iaV7I0CoiSqxBixGcFi+jx2+f5/vd+ALIxf/D1b3Bua8z2KCcs5oyLVLzy137jt/ilf/1J9q7sU1ZgkkgrihLFYWSIV8wShqiCpfIvMUYkRrx3oE0CYofhP6zC1y2UT9xm937AH/BfMXzX02mT+tdt38SuR82zbpED/oB/y/F9PlqMCv/jVRUIVYWIIxp1CZU616F3qApLfhIhc03cV5qqnaUeahu8eMaTHSyfcObCAzz65rdzbXrAxz/5SV5zzz2MM6HwjoPr+/zcL/4LvvDkV1HNCKVhCJXJkryiuTo2zYHT5d5cU5ATAyVluK9aV2siEuEnEX6VWD1zxD3su19997Mrd+RnP+DfvfgncaNvq3nr2jb1OemcA/6Afyvx/Rtf+8B0a1T48ThjMhrjnHJ2nIpLjoqMvMgAkrdfSKbCvNDlBCKHy6wggo+R8dYWV2bC5Ow9vPvxP8TlK/t85nOfo/DK97/5UQoLfPH3nuCTn/kCz7+0x97BHJ+NcTWRApg4ohPMHOYUSKQaQiDECitT4mFRISMlCp6FZO50Lq0xhIiF+cxs8QEW+0+wWU7TZz/g36X43T2wTYx4nLY+VXITqx7Vb8Af8G8VfhTnPjwq/Ju8eIyAiDLOElE0mTZEhBhTVvloMQ00aBwUm3yJTlN/zTzix2SjbR77vu9n+9w5Pvu5L3JwcMAjD72W+fWr/Pw/+5d85okneeGl64h6RHMWMS0MHIgSnSB4UKnrWArBKghJ80oZ9ZsYtbSYypK7SVMKBgHEeUH+ogm/TqyevU3u/YA/4L8i+G0C6wPapM71tfUx5TqVc5MKOuAP+Lccv/DZU977/yQClUXGozGTOqehcx7nPSJgZsSYUkVZNCxamtXqjPWkpMAiQswmiBa84bG38MBrXsvXv/lNnvyDL/Pgvfdyz9lz/PT//bO8cOkK+9MF6nPKMlJFwYkHJ5h4ULfUxDBLHpAhVXkWwNXkJRpBjCpGKououmUiYlgV7FTnc9XsL4jTZ61afP52uPcD/oD/SuBr66Su+bupb/d93NDnqLiBAX/Af0XxK/iDq/vXD/anU2bzOc7psoBljDGZ4GrCamLCYm1KbMRiei2STHfjc/fits6wtXsGVfj2N75ObrBT5Px/v/RPmQfl2iIS3BjTgvl0gTfHyHtEszrzva60KBKBopaCq0VQZ6hLuI1p08yWuRnb0hCa83kRJf97brTz93ru9an77Af8uxO/27E9eWPX7FvgcYLYmvEnlQF/wH9F8BeLxfmqwiMeM2W+CJRVyv6+OiKxnq3JfGGqkDm08GheH1lOVozZm8Fjb/t+3v3+D/GFz3+er3z59xn5yD/6J/+Ebz31FFf39gkRzGccHEw5c/4+nBpiAVNFnMNEsToPo4jgiTgL5GLkmrJdaWgRqzm8y5fJh9v7cg25mRniciXb+as6Ov8kk8mD38t7f0wZ8Af8E+H7NZ36OmvrfXeMcvT4tmyaa8Af8F8RfDP5TzPv863xmBhLDqYzttQRW1oVgIqk/S9L7vXqlDxLGeJVUxb7cVGQ5TmPvPMHefNb38qv/It/zqc+/Rm+892n+fJXvso8GPNKcMU2gYyyLJnsnmE6nTFyDkdMnpCA2uGlr9YRUU3u/CYhZboHvHdkmSeE1bjYzSJiljKHAFHz7yPGb5Lp36e8/je+F/f+mHMN+AP+ifD7vBDXTbpuocdtP27/AX/Av+X42WT3fcL4t3e2xvqjH/sAT3zpS0wX+zy4PcY7x2jkGY9GjPOUpR5JBLaIMNnaxhU5AYdknslkm9HWDtu7O7zpDe/l2t4e/88//nk++ZnPMhmPqaqK6WxKVhTEwDIouiu+rk1GMKJFqirUpFlrYt4RQySUKf7LalLKMo9TpVrMAZYmzvZY5/QQwTXtFqd/UM7KPwIHz75a9/4E/Qf8Af9E+H1qXmx11s75TeOPuoC2Srip/4A/4N9S/DzffofF/BNZlumH3vsDfOJTv0NZlWxvTZjN54RoqHhUPMGUaIKIR/OCUT5mPNri+v6MUT5mNN7CjyZc35/x8EOvQ9Xxj3/hl/i3n/08Xh2z2ZyqCownE6oQ8Jk/ZOprH0tnEUt7b01V6Kb+2KELVSXzqUK0iBBrsmqkm8exIa+2SREAGb3VFeOvumzrP3417n2r76l89gb8VxZfuyd6Juxr6+t7VL/24o4zdsAf8G8e349+qHLFZ0ejyeTdb38b3/7ud3nh4mVec/+DLOYR5wtEPcFS7FeMQhSPaYHKCDTnxb0DsnzMtBReemmfL/zuV3jo4dextXWen/kH/4B/85nPUoaSYjLCZQ5TmC0WqeJzi2SWThmt5MGxwbXktOG9Q2WVuqoxDaoIrnb1B4gxmRdFImYBs7C8xc375lz7tYihqlvqxz9DvvNPX9F7f3iu0/fsDfivOP46lusOWtd2FPP2LWLdDRjwB/xbiu/zyX8j2favbu+cKd7wyMNsjcd88zvfRV3G8xcvcXb3LONiG6cFIgUuGzOe7DCZ7JBlI2L0IDlFsc23n7vKv/qN3+bnf+U38dk2b3vb+/jHv/Av+JWPfwKAvCjYu3qVaMaoKHC1xtQmoLbDRWyZ/VbehtqkEcYwyrJKRFW3NWSYTIGN96QtzYtt6cus30hah4Lf/uNSnPkakN/qe88pf/YG/FcH33caY7ux53y3ra+9r607vm/MgD/g3xL8LBs/HtT9dPTjdxVZwWJe8cbXv55f/Je/wih3VFWFGXiXqiarc2hWIH5MMOXatGJ/uuBgNuPp557n2csvURoElEcffZSf+tN/ho9/4jf5xKe/gPgM71wyF+Y5IQRmMVLkObP5HO9zPImYGq0quetHxNdkovVfGnJLLv0hpJyHjfPIspRLi/ya1w05qsrSKaX9uunfNjs6J0SKN5LtPE0pb4a9F2/23ve0napnb8B/dfH9hsbueV3zur2o7hwnmXPAH/BvGj8bbf+c4f+Uqc9UPILjT/34H+Of/eq/To+7KGd2z5KNxlhU8lGORMesLHlp7yJXr13jyt4e16YHzGaBYjLi+v6cfLLDzvYO//5P/Amev3iFn/2Ff8bVvYNl9g6nSlEULBYLpgfX6zRQkfHIo3XGtmVwdOPmLooC2tK6bGnKjMu9MNekm2ppVeqUsEi3oOtK30giNIixXyOLMaZkwdn4guniKeajd8DsqZd779d8bjfArpnnuH0H/AF/Oe4kuRDbsol5TzLuVs0z4J92/PH44ZzRb6jLHw0CohlZ5nnfu97FV7/5FM8/fzGRR7UAIpn3nDNifVwAACAASURBVNndIZZzJChRA1VZUYXaE9A71OfsLyqczxhNJvyHP/VT/OB7f5C/9T/+Xa7s7bGYTdnySau5fv06WGA82a7TUcXkkCEpv2KMkaqqCDEuC2jiaq/BmMgr1nthjTinqOiK4GI8pIGFxfSQ5pVwVlqZc3pIA+tKyaoCdRUCVLNrtrh6HzA70b0/nty9z96A/z3D1zUd1r1u3vcB983VPR973g/4A/7N4WfjD7hF/nmkeNRchtOCLM/I8wIR4aWrV6mswszY3t5CXYZzytW9a8ymJfvzGQcHC2bBUjkTnxFRplVEnUe88mM//Ef4gR/8Af7OT/99Lr34ImaC+oJFWbI/nbK1tUU+mlBWVVqgGUWetpYa8iqriqoKADi30qoazSvaYfLRusimxVgn9Y3L/a/Gy7Bxme9qYOv2wNoZPwRZziUImk92dHLhWye69zf2XXf+7nz2BvzvKb72dI6d1+2BmxjzKDVwU78Bf8B/mfjFT4yK3V9zxfieMkLmcwLC/v413v2Ot3GwmOF9cmXf2hqxfzAlhoCYw4KAhyABzT3OO8oQMK9ElxGIaOZ43w+8i8ff9z5+7p/8PN946jvEGJKWdXCNgCIuo6xSYHKeFah6RsW4zsNbMV/MKKsFIkaeKapGiOXSvR5WRJT2vGriqv/dcENrovN1+Zdmvyy00l4tg6F1pZ01Th+qCUtjhbMAElKeRQKI3u/HZ373ePd+42fad/4ue/YG/O81/jpW7Zt0HTseVzaNGfAH/JPj++0fykc7/7CsbFt8xvbWDtevXWV7MmH3zD38wLvezdPPPs/BYoaIEDAk82RZhmYpEe6iLCmKnLIKVBh+nFPGRFyTyQTNPR/7yIf57O9+kd/53S8Sq2S2W+xdJhvvJvf2OjO9r50t2tpQqE2S0DhsHI4D2+QtuKntONKYD7uOHI2ZsZuKqllPwL9T863/buO9P5ncfc/egH9b4K+buG9g+9wmNl4HeNSYAX/APz5+NnmfuuIXgted8daYMgam5ZzJ7gVeevEyH3n8cb797DNcevFFALLMY1ItY63MhCCg3iFOCUoiF6cpS7wZlRg/+kf+MDEav/bJ3+Dgyot453BiqdgkoSYBQBVUl6SQnDHCDcmABUEjaIQQ41KbamfR6JJKN01U45LfTJSy1CctqnsY/edpvfakw0VwERDBNP+bsHV/773fLHf/szfg3zb4x2XTTbbLvjm6quDNyoA/4Lfm2z2vfvzPfTHaTRkrajOcOUKMFFvneM0DD/A7X/gSIUYy79AMYkgkEUSwmBw5RqOC6UFJlnnUO0qLjLIxCyIP3ncvH3n8g/z6b/4mFy8+z3h3J2XDwJiMxsTFYpkRXmS1xHY5liqkPa+l40ZzEd0MGS1pXO7b0u23jAnb4KSxUbuLySU/tLwim3WKCOK8l1x++cZ7f3gZPVPf5c/egH874fctoG/AJtvly1nkJuIc8Af8jfjZyP2Wz0b3qipZkVHGgC8y8lHOwiIX7rnA9vYue9f3UzZ5s9q7MLmmN9qNdwWhgqqKeM2xqFhI2pN3jh/+6Ef5xje+wVe+8U2K0QTMqKo5mRMsLMh97cXXaGFHiBgQD8dy9Ul376sd93VS6RvTEJamqi3EWstbamikA1e8J8vG7++Z9tQ+ewP+7YWvnRMnWdS6fsqNi+y+P47dc8Af8G8QV+z+Itn4LQ0JVSE5VGTeU1YVzmV8/1vfzP7+PvsHKU6rJBJiiaglsxvJfBdCYD6v0CInCizmc0SE6eyABx94gHe8/W382m/+W2azWfIinC2wMqARJELu9AZHjPb+VqjrsvTtM8VOot2+kih9sknjghUZNa+787XNkc3aG22uGbsiNCX6/Of7YNbA39XP3oB/++GvY9KjFrHpfNywkD776IA/4B8L3xWTH8eNflJVycTwpDx/ZZgvO5oZH/ngh/nkZz7LolqsJqi/pIM1JjNYLEoCildPDIZZRETx+RYfe/xDfP3r3+Kpp59jsagI+1NEHM6Ecr4gd45YVbWpMM1nZgQzqsY8V5sP2/ht6e53Netvimr2nYcV0Wwis8ZEeUOZldb41gm09dbVh4gQJXuAYvITPRCn6tkb8G9P/HWN3Umb98dl03X9uvbRAX/APza+6fhn1Hlpp1dyqozygv3pFIC3vOH1zKYzLr90BfV+6SjRBBeXZdLY8twvPQerKsVYqctRn/PgfffxsY99lI//1qdYHFyHKJDllLMSdcp0NkfMCCEFPlehIsSwJDGzOm6rLNdcXnIYgX5iaxNMl+D6CKlPuzqOtLOCHMryUWcWUREwA/SnOeXP3oB/e+Ifh+3WseU6Bu5bxHHmG/AH/LX4Ltv5P70b36viwJQoBdOFQDzD/nVF/ZgS4/WPPsj1+Utc379IQYUnkIcAJfhKcQYhLJjanFCUBDHycU5VpuzxYTbjz/74j/DxX/4Vvv2Nb5GJx4UKqvTjMobIaDJiGiqmIZCFEi0XuGqBjwtcKImzKXE+R83wKngVsAhiqAPnBcTIRBAzIJGeWQQM5wTnZHnO1FZqkQNTS0fUQwf10extOSRpVtGWR2qLqEWiKdFapV6iIdGwEIlVQEOFt4hY/lrYvud79dn39B/wB/zeQX3gfed0zfl1clw1dMAf8PvwR+bzPw/1XpFZnZDXwIzJZEyeZThV/tCHPsQXnvg9VHXpAdgN7j20AFXMjCwvqELgbY+9kZ2dHT71uS8QqtDp28piUX/pV7WbfBNb1XWbb/fvrqEK4Yb8iH1ys/FgL3fOdh/v+en65Wl79gb82xj/JPbN7sTrVMZ1/fvGrrsRA/6AvxRX7P6/4vIxastijiGkXIPT2Rynymx/j7e/+TEW5ZyvfOObzObzRA5BwFbFIUVTMHFTwqQiggplWXFmZ4c/+rGP8pWvfZXnLl5kUZsA27kGu9IOVLaYKiuHGDFsZSass2F056iqUGemP+xx2D1utazzTFx3zqmCz3+yPn2qnr0B//bGP64dclOf4/Q9DtsO+AP+je15/k58/mMWjaoKiDZBv5Es82xvTZgu5mSjLe49f57Ll15k/+A6eZbKnEg9k+sgiqTYrcx7ZgfX2dne4j3veBvnz5/nNz71GWjvA9Gf8b39XlUwuIGQlvW/YktLa9XwWuZAbJNYvNFB4yjvw+NKm6iOQ5Ir70nxLWeO0/HsDfi3Pf5xGHSTdMdvIsSTsPaAP+Ansex/RtQZFYYdyvfnFMRZXZlY2N3d4YVLlxBJFZH753NgjhiEiLJYlIy3dhhPRvzYj/ww//LjH+f5ly4TQlhqUG1vQaU+THD0ZM2ota8bYJs0TXWplMaxpBvg3PY0bIisfe5m5OVoc+0CnIL+b62mu//ZG/Bve/yjTIjac64tXbbcxJ4vh7UH/NONf1598fjqdKgJIpUkCTFyMJ2S+VTW7j3vfDuf/9ITzBcLbDFfxmE10tY2TOsCjypMp1M+9uHHeebZZ/idLz6x9ExcLqbH3R1udIMPTTkUq7O7t7SvPrPgDRnkNxDV94K8OhOA+IcZjV7XLKnT42579gb8OwB/HYv2AfaB9018HLY9ijgH/AEfNP9rojIirPaimjIiOAgERJKzxqMPP8j29hYXL11mcf0ao63ttHfTTBgFs/S+TSTjrTFulPPB972P/+Nn/+GyBIqZLcuZ3LhERcTVf1vkVTtk0BnXzqSR9tOSaVKbC66dUZqj77wukVfHcWUdeR1Fim3NMp1w4iX7O60b0ZW759kb8O8I/C7LxXbjGsCTLGDdBa1b0IA/4K/6e/dXxQyLFZgtCUlVcc4tY66cOsZFwVPffor5YoEfT5gd7BPKcCNwHWzcxFodXL/GX/nzf45PfPKTTGdz5osF09mc7cmEg+mqruO6QORGGvMgli6hyTrfbm97Impn+/mVcNY4zrw3BDVvEhF8PvmTcH6303L3PXsD/h2B3/4xt47xNqmK3dfrFrtJdRzwB/yeufI/o5I/GkNA1ONRJNiyVlaT5ULzjIPFAY899gbKECirKpkUY0RFyDIPVWBRlsuxRZFDCGSjnDc+8ggXzuzwW5/7PHmW0lHlecb+dEqRZ6hTRIVogohbpokC6jyIEaMixBKjqi8joNJkg69W9bYkYFREK5fnkYBZRarFlfqpM9TZaoxVqU/dHwLRquXN6maxb6ez6sv20YxpApYPaaotMgutZMTee6xaECJ++5z/26/sZ9/7+qh+A/4pxNeeTpvUv277JnY9ap6+MQP+gF+rWfzXKUNuXBZ7dHXuQVilViqritF4i9c/8jqu7+9jZkwPDvDZCHXKwXTGZDJmMh5RlhUxBmbTKahRlgs+9qEP8iuf+A0uXrrEoixTMHPtGu+9P7Rf1bcX1q6i3CddL7+2Y0avt+FxPANVbtAIT6rBHbe/1mELsd5PjGa4rPgPuJufvQH/jsHvG7COMTexZZ+6uIl5+xY04A/49Tj/EfHZOyUaFh0ej3OuPhQTCEAQEIl4B1tbWzz3wsVUhMQlTWk+T9k1ptMZVZVqdzmfUYxGFFs7vPmNb2Ixm/OFL/4+YopEiGWFrzWTqqoOkUyqwZUOk5RXUYMtDxfBmeBN8AgusjrfvDaQYEhYb7o7afxXt2+7vtgNN7fZVzuGuNpUuyRLTa/zfHzhzJn7Xl93u8uevQH/TsLfxKhHLaqvrU+V3MSqR7H2gH8q8eW/VbzEWKGiqKu/SNWnAbb6YnaagpRDVXL5ypXkmOGyZGI0Y7G/x872VtLURgUKzKZTzIyPPv5+/tW/+c1aw0tfzqEq8d4jKss8il2i6XoUNl6Gy9X3aEd9hLSMMauDq5f9O5pZ09bW2tqZ5rtY6+TQdZxAA2vGijqiGWUZKCaT/7WZtvX3Lnj2Bvw7Cf8o1tzEpH1t2nO+y9R92AP+gL8aJ+5DqhngGDlfmw31UOBvcoTwhBg4s7PDuXPnOKiJqawqRITxqODcvfdz6eLzjLOcq3tXiQF8VvCD73g7n3/iSzz/3DPk3lHND6jKCuczIGWqz7xfZuzAHT4MJdZraks7a8cqaPnwcah/K9asK925ox0uQtk3rm+e5Q0/TtGyloQQUrorM7D0gyCGwHQ2R332h7vTczc8ewP+HYXfp4H1qYTr+nbfb2LVdRc34A/4q/5+9FHx+cTMQJLmlZHivBIhUO9FrQpTnj2zy+6ZM7x0dW+ZAzHPMsqy4vrVaxTjbcyMc2fPUVULzp8/y5vf+AY+/+nfIcvHzGYLsnwMgHO6KpGCrUyXN9T9Wjk/rNO+zGxtCiptaV1tx5C2dDWudftj3X25vvedARyrAmd9Da7+AZHeRxaLOfPKRpMzF/4r7qZnb8C/4/D7VLeuSti3wKMW1B5/UhnwTzN+ZT8JGSEGRi5D1GM0ZrieL10n5KOc+fyA+TyVVHGaSKjRHnLnqarAfD7nwfvv58f/vR/iH/z8L8JkjDPIRBhnGSPvlpnYR6OcECLiNWld9RoqU8ooBIWwhpyavm1tq008WrvY+3q/rL2P1uyTOSNlwK8i0t1nq48uOfZpX10iWxeU3SfOJZNhU3UaQNRhsWI6nZNlo7/E3fTsDfh3HL62jnUL6VMDtef9pgV1pW+uAX/AB5E/5yXtaxVFvuzUKB0qK82lIQkRYe/aNYqiSCmgRJjPZkzGI8ajgtlsvnSh//D738sv/+tPUF2/BrXmMx6P2Nu7uvxSTxpcvsRvzJYhroKVl0HLNymHqiXfYG7sz1LfJqBukuBNbvPtv+s0wxuk5X1odYwbMaZ4Oz9+Azw6Wjdyzfnb99kb8O84fO107FvgusV1WfEkjNvuP+AP+PVcxWNk+WtLZvjRhCnCXGEmRmXJ85BoWBXRKuDr+lX71w+Y5BNiaWhULAouyzmoKmYxEnKHbo346Ec+yJNf/TIvPP8sznnymuwWiwXF1jalGSZKXhQEwERR9ah6hPTl7yWSqeFjqpcV1RPEEUTSa3WU6DJjSNvBowkFaMdpUc+7SvS7Isc8z/DebTQPNhjQyrcYhRBvDKReiRKj4NRQaX433Fhg08xQ58AqMge5CD4GMqdomHP92r7snp3+97fms68Xdmqf/QH/5eD3dV7HfH0seVR7t+9x+g/4pxVf+S8QBdE628aNThJdGRdJARiNRq20TsmJozElAjzy0IOA8eRXvsJknMZ4tyqzcmgfi8Nf4uvc1JdHK3mvdjSd5ZxrPBPbCX7bhOa96/VwXOL0aFDHMQtukm4gdN9al/giVCEgmv0l7oZnb8C/I/GPUgX7JlvX96h+XbY9auyAf9rw1f2oaIa60Q1Z3o2UxLcri3LBwcGUa9euc/bMLjFWTCZpfLVYoKo8cO89vOnhh/n4v/00xWjMwXTGqMgpy4ogUN0w60pWJJVEYjrMAmZh5Zouuqr/1Zf1opVaSiwgFogxkVcTON3EbjUB2zd4LN4kQXVlnbmxkSaEoH0cag+B+SLujnbOfYQ7/dkb8O9I/HUs1x20ru0o5u1bxLobMOCfdnx196vzS+3jOLFV0Yz9gwP2rl3jofvvR1U5ODhgPBrhsozzZ3d57A2P8rkv/T7z6XXMjJ3tLfavXzsUe7VOer0DreUV+DJI5ob9tFZowCHSXrP/dWiuY9QJO0mmkLYsQwg6a1+RtjBfLBj5/Kd7ht9Zz96Af0fir5v8qAk3tdPT1u4f14wZ8E81fvEY4jOtzWcxxlTAsmvOqjUxq01rEiLz2YzPfubTvOcdb8WpMh6Pme5PydXzmvvv56vffIpnnn0OcQXbW1vsvfQik63tVWb7HlkFKcfDLuwEjHBD/6Z8isYKCUmn65r5lIhYWM5rLTLQznU2dc/WkXhfTNlJZR05t7XBQ/XKbJUdP5rhFLCSKP5tPdPfQc/egH+n4h+HUY9i0vaiunOcZM4B/zTjq/5xUX+oPMk6zWCpAbWcF7789a8n5wJN+2bndnd437vfyYtXrvLMs88iImxNRly5uof45F3Y1i4Ok2SbsFZf9BohhnhobaJyaM9sncR4OAi5bY5TkeWen6osPRDb0qeB9snLNTNu0vaWJNae25pUVcpsVsp4+/yf7kx55zx7A/4di+84vrSfbum8P+5PQT1ingH/tOL74n92+eSh5isyxJBSOq35QhZJZbcy75nuvZTixULk7Y+9CcwYjXO+891neO6Fi6g6RqOC2aIkhjmTyYRqVpI5h8nhAGWjLnUSJa0sGmJADEBt6gsGRATwRMQMxXBy2OlCVTADIaDS9hKMdYHIw9jNPlmfFtTnVHEUWYmsNw8eVZyzr3/3Q08/f41oFar2faGc/+8blnP7PnsD/h2L3/e0KoeZr8uC69hS17R1z6/rN+CfYnwpzl7JJztnYm02LKuKyWi0LOcBK62j/eW9qCp2dnaWsV4P3HMPi7Jif7rP9f0DlBTXlflUKmUyztjf32fkc0SEUGf0aIgjkpwoBHfoy79x2EjkBVa7n3vi0luwrT01zhghxKWrenvfjhgRl7fIbuVi33gmttva0szTPd/to7Jeiz2uRtc3b1d7DFYhJhYWe90F3RHP3oB/5+JLT+fjLu5WyoB/yvHd9n2Vc7k0pTu8Kt4nA0E7qFdCPKS1RF3FUy3Lflj9xW2RvEgpopaxWFbXEatTQwVxS3f9ECLBUiYPUTmUNLcRsWQG1JD2xjJ/eF+qKxbLlM2iXvPSNCiCiE9ziawy7dfr6JM2cbdzLq7Fr2uGrYsHW5fCqmlriLi7hmVGe5FVhLkIEsofqar9f9U74Xr5nj97A/6di7+O2frsk+vskMeVTWMG/NOMP5ncbzhp9odOuo/TaFBOlcx7vM/IspwsvzFJRDfo98hF1/s/KoK2soG0/7bn7ZVWfBcdMmnvfzXzHHdtm5IEt+dY59F4SyXZSv+HNa2377M34N/R+Osm3rTRdhxW7gM8CZMP+KcI31X6YYvhUCBvk52i+WLWaGhsayARCEvHCAnp0LjKJehsNa454EaS6H6xtx1EGhGMtBlGvQ5bXlIfeQgBabwVW6SldTYPT1i6zjemw2bscclmkxfh8jo2zHWUe/1R51QMFUMkps9D9R3cYc/egH9n4x+XTfsm2zRHXPP65cqAfzfjO/dnoeXt1+O00JZDe1MdjaqJrQohEEI4lOFinbSJcpP2JyJ1XvzV+z7yaq+nuZ7mXLTDOFJrYMAyI8e6Qpd9cmSc2BqSPq6W20fuG8QBZ9vdjwWyWe7uZ3/Avyn8vgX0DVi3Qbeu7SSLGvBPOb5J9nhyoa/zBLaS9XYlaV5xSTqeiIuhXsaNR5MxwywgEpfJbzclvO06KizXaUnrUjW0voiuJqcSl5pXYw5t9tsklmhM+1JOtd770hVmTV5dAl8nyzgtXR23UrpaYacRtYh2HMnUj/7mEdPeVs/egH9n42vnxEkWta5f83973cL6xg74pxhfXPaAtupt9U6q/V/q60xkbc/CPu2j275Oy+tqMOvw+sa3s2ukcSv8dE2raz4UW3ZMAktz9Pfran9HeR0ex2y5Tvtq4uDMIqLyF7tL7E6zof3UPfsD/s3hr2PSoxax6Xzz8/eo/idRTQf8uxffRxUPzZesgPWZD+t9lvbgFvm0S4/0ZpPo0br69sAOOWaYJceNPgcNiSkrx5Io4tJtvavBOauQWKZhspq7vY4+c+NJpZ3RvvFuPA4ZWmctvXMfg7RFFKI8sAbmdnz2Bvw7HH9dY3fSvo21TeDr+nXtowP+acfPd95knVmOswcUO9rKOu1M1mggm+S4WtZR56nxk3dlOtXsdzXu9F23drkJAmvGNW7u7Ws/iVb3cmSZjURFyfN2aqnb99kb8O94fN85qWsW1reIvr6b7JZHzTfgn0J8Z/EDWEyxV0tTW8Q4XDMriEvKmRkmq1RSPruMWI7FHAsFFjOInuhq77i8JNgckwrnHWqeqhIseiwKRVEwn89wHspqjriK3OdUIRBKh/oMM0UrQYhEMcwq1EXMIsT0X+iQ5mWGq/fBPMrcIBBJLiAO9Q5RITfBLO3nCZFYM7k2MV6a3q+S56YUBEstTVPdsia2LWX8METrWLeG5GtyCRxOvBNNm2l7P8ZV7Bw4pPWjYeVdaUuyhNDE30X5GPDkUZ/9hraj+t8Vz/6Af/P4R7HqunN9YJvkuGrogH/K8E3kx5o3L0frEGt/KScnC3HJYQOJlAuDqKhkqCVHEVWPc44s8xxM9xhPHKORomp455jNFxR5vgxmbpw32pK+zI9K5ZS0r+Y1jSZU71tVISxzIy5jwpYmz/5b1t7Tamuq7fg2muMmpauxdTPTr/bsVv3T9ekPt4etmf57/uwN+Hc+/knsm92J16mM6/r3jV13Iwb804Kv7t2wPiPEpnitJFnSupbTBUQrkAqIiAoqBVhOCJ5y4bGoWIQQYLwdyEcVb3nTgwRbUIXA9taE63tXGeU5Sq1NacCkYpmGzTQdHDb9JQ/EaklCZrZMDtxIKNPR3rfru+7jSMo+sun+HH+uZTzXoXMt0pKA6uH2tmPK0otU9O3tJXZe3z7P3oB/x+N3TYh9oEct7Dh9u6x91JgB/7Tgm3+o3XEdWfV6GmoyBaYOijqjKU+p4gCHSkoIHINfEoa2zJXOT3nktQ9Sxn2y3IiVMZ3N0GzMdDYn69U6tBXovJ4cVISqrYFZXQfMADN8TyrtaLb6H7xGA1p6MS69GYUQUnLhQ+NfhnT35I6SVTYpqzVMReDe1od9+z57A/4dj38zzzrcyJbr5jspaw/4pwRfnNta53l3HNduCzkWfP3LP6KaDnEVEDAiMaayHyIO57Jl2RJV4/w5z/33TpjN9ylyh6qSZxmT0YQsS+TYaCZNDFpDYtHSPpVJ6HzxHw4JMFPAg+oy/qvvGvucV27IxdiQWMercp0Ty3Gkuba1919COlhPcOnHQfO9IlvtS+A2ffYG/Dsf/ygTovaca0uXLTex50lZe8C/+/G9upQNd5MZbfMXsSByoyojAurrL97anOh9Iq2qKinDnCpWbO96Zos99mfXOJjvMz+YAhnX9/ZYzKvaLX1VyFI0kdi6PTBhVR/sEPmI4J0j854s83jvl9WN21WO23tga+Ou9OV5Vt5se9fdfq2WLJJxWG7HZ2/Avwvw17FoH2AfeN/Ex2Hbo4hzwD8N+Pn2mxMhBCBgVmFWgaTXzfmmbaUJhLpESUixR4BFhZrIZBnca6gLICXqZoguiMwINse5wNbEs7Ods7VdsFjM2R7vsLV9ltm0ZHtyjkLzer5GA1uRmEYaJ0GsNg2mvpqOniBqwYG4pQmzcdroyg3EFBWi1nt36bVYt9yLLR04jMPn138KrYvoSPKmDGDh0A+Jw3uSN65bECyaAOfXoR5x/nQ8+wP+LcHvslxsN64BPMkC1l3QugUN+KcJ3+wHoU04N0pXC+km2T205KggfhkILS45deCm4KaIP0D9nCyP7O6MeOiBc5RVxVPPPIOq4/r1GbN5harn+vV9nG8rEgaailoeuugeAtI1qbCa5LpNvsY2kdUDliVhTuKRuQxgbhPasWsF9sx3DKeSxJUpvi05WOrqxwQRyF5Xd709n70B/67A1x7wTa+P6rdusZtUxwH/1OLbRzUYGg5nkKeMSEjFI10k/TVu6JchmDUFLxUzR6w8ocpozHvjifATP/x+fuqPf5jdXSjjVUaTkoP5S/gi8vCDj/C6Bx5htl/iccRFRKMnzyfMZvOVZgVITPXALFSYJDJr2rXOTm9my6S8UGspZri6vpmZUVXhkDazNB/We2TL+Lda2zp0x8yIUQiBFQHW+2EqN5ZraaSvovM6USJ6hLVHhNrLMi7fxxgwrDbp+jfWXW/TZ2/AvxvwtafTJvWv276JXY+ap2/MgH+q8PX7bljMprpaPdLsSYkA0dUu9SvvxPNnd9jeyliEPf7oH34Xr3lgm/2D61y4MOKZF57hD776bS69uEeoQMyj6sizjDzLcM6h0u/in8qHtC53k9bSVjUeuwAAIABJREFUzocYD5PKUaZEae2JtUuvbKrG3B7/vZN4/3E6dd6fomd/wL8V+H0D1jHmJrbsUxc3/4S7sf+Af8rwRd3Dm4oyHlrUmjZVW5nsaoOCWL5sn82mPPXdb1OFA166donXPXKex9/7eoqR8fpHLvDWRx8jp+D6tSmiQuYd+wd77B9cIfNSa11AlNqbsE2akdU+HasA4g6ZtZP2RrO0zh7Hk0bMFDNtkZdHxKGaMnk0XpQvV9ZrY5HNH5t1jg2iYWtzh9P97A/4twZ/E6Metai+tj5VchOrHsXaA/5djC/iL2xY20bpEl6jySy/nM1BdFx66SWcU5574SIXL7+IWeD5F5/nG9+6zOWrF3nq6WeZzUucV0KcEZkyGkNeOKo4X2pZhoFJcqKos38szZdNsHLHeWK1P1QTbKuQZp9m13WJb5dIaZ/ry2t42Fmk/ndE/sOXm2/xeKIFt/GzN+DfHfhHseYmJu1r057zXabuwx7wTyG+GuO+DPLdYzlRn6a21GQMtERILvNN3FJZwdW9GVeuzLnn/L2EYCzmM97+9gu86+2PcvHSFabzKbiIyRw4wOcL1C1YlNeWmSkareg41pE+B4q+WLe+zPUNEbuOifAw2RxeR3M/1rrdH+npeFzN60TiuI2fvQH/7sDv08D6VMJ1fbvvN7Hquosb8E8nvo+o9hFVV46jKSSiMUxKTMp6HOyMz/Lkv3sa7yd85WvPgAn33nMvu1tjrl2/QrSAWSTPjNEoEqxk/+AKJgecPTdZEliMQlyaEevjWOvqiQlrvV8XqJwwbelh+HLklc5Af4S0F327PXsD/l2C3/dzsqsS9i3wqAW1x59UBvxTgT++YZN/E5mt/RJve+lpibgKcRVWxy9dv14SKs9i7vn205dxuoVznirO+fK/+xaLcsYjD93Hu972Jh5+6F62tiPjLUN0wbW9F+sNsBpnGX+l9QX2XJ4asuGqu+VS+pw3WpNx+Bb+/+y9TawsSZYm9J1j7vFz7/vLfPmysrMys7uLLkaC+evpaVqjnkEamEbTSAOLGVixgQ1CIEYgwQaxYMEGiQULVmxYsEACBJoN0iAYgegZBjUzre6enu7pv6quzq7sqsqqzJcv37sRbnYOCzP3MLcwc/e4N97LuBF+UpE3wt3MPnMPe/7FOXZ++rXSYtm7P5Myc4T9u8y+3RFk6Bf0WJ8zX/sz/rHwq0KjXONYRUz75NTH0phjY834l4Bf6Tf8w3w4Ae34Hk4ghLbER7svRQYqDFHBenGNVy8dmJb4h7/+W/jwg0e4fmDwT3/z6/jBJ4LNdovnrz7Hj733FN/48H1YB3zvj5/jkz9+jk9/eNMRVpd5Qxhgh6mSy1gRV2pOU0t9dTqTZonvdiK2cOKrX3sz/tngV5nOQ4OWJtcy5tRfXXH7Gf8i8fmvOFUsIlf09sHeChEhTU3bamgtAUgDVJVB0yC4mRs4J0ClXazWas0Q3uAbP/k+VmuH9997C9///PvYOMGPf/MaL158hqvHgre/doVvffsTPH30FD/1J34C73+0xd/9f34N2xvB9uYG1oZchgj1x0RR6cswr92V7RLcAgKCMYCI7TJl1MaPs7XUFXtmosj5IlyraQc1UIRYK/jaYQBQawNxAquuu/WeDP2+oEP/XjL1yZTbUjQpZ7W1KdV2B+LabO0QqhJiwfx7QwQGYGEBoR9lvvdwh77qtTfjnwt+Lht9iflyg46dH5pcqf2MfxH4/KfbnIGpYwOAXdwU+p/b951XntkFAQOAc65rAyiWK8LDhwt88ukn+Jk//VP4td/+dfzGb30Lbz1d4Cc/+gC/8U9+D8/eegcff/eH+OR7L/Dyiwb80RVuXn2KX/3N38ermw3shuEsACU4qcFkoUpQEVDV9ybc1cYKD/pexvgoJRO0T169mC/aCxtIqyv7gYZveMl5o6TdpkmFp9qAYsKOjn4v+nBia2/GPxf8Kj1QGDA9V2LcoXZTLnLGvxR80q9T9ASOnRn2TGqFYGJmAkOgcKhMHTJgEIgUxAKRLYiB1Qr4C3/+n8Vv/PZv4oc/+gx/4c/9Gfzm734Lv/R/fRu8Urx88RneefwuHj98jOfLG/zBH36KT777ezDLCtxUwbJGQOeaLlAimPCvp2QKJSpwTMjWgahCckxe7bW56Fzcpj0Phy49VUlyJFXKXF+6z+Wx9ylut4epH0eHT2vtzfhng19lOuQ6pedyx3OSm8QUm+mMf/b4/CR+kDJR1iOPRnaEiBXiHFoyEFXUhuDEQbHB+++9h4cPKihu8K0//AHef+8hNluH2lxjfW3xUz/5Ht5+/Bi/962P8fvf/g422wbupeD68SO8fHGDZW1AxDCGgkdg+7APZkzNx3ONEkGBkLsbJ9r5pzD2SUdEQYXg7lKJlVTT3TPXpo4lB/h17JNZ8wdop39ya2/GPxf8kgY2dcChScXn0v65PjP+JeETukwNqTND+uBNPffa9yKAqQHnLFhriIQxWECuwXJpwKbBs2dv45f+31+FWMLzF18CavD58y0eXb8De7PEL/3j34JrBGwYy8UT2LXDzfMGjx8+wctXN37SXRByMFGC0LpbxPPLaTdT02PF7XaB0GUSyn0eO5cz18aSu9eHSNTt++Hv6a29Gf9s8KcwasyeyLyX6HM6xiFjzvgXhE/gFScawG3iluJSH04k6i94/OgKz54+xe98+9v46T/1U/jLf/GbPtksC9579228/95T/MF3PkPND8F0hfXyCZotY/vSYlFf47PPnnfxXwEkugPa7b9NqZPVOnCkEgc4T63JlYYbyC3c4KfgTRtn/xj5dPQlL8SvfO3N+OeDn+r9Q1ICGTsXyyF4M/4545OsARl8kO4yuu+36faLlHydLQBQB2afMJdNhXeffg1ffHGDJ9dP8cu/8jv49LPPcV0v8d47T7HdfoEHK4W1jJuNgnmJF8+/RPNqg0cP3oJzQGXW6OK/yIC48mVDgqfgmDbTHUoJxueX2osBa6+JOUraG5F6msNwTOIfBekYpR8LuewgY7LfVJtMs9NZezP+2eDnBi2xHaPMtqWx0uOS+TzjXyA+CVcAumrEOa1FNB/YHDs7iDNgqjovxPahbHiBtx48QcXX+Ie//vvYbAm/8zt/jI++/jV8++PfxfvvXQHmJaxzWK+WEFUsVtdYLtd49eoG2+0NjKkTD8P+HlXr8ZiT9KGe5koc0jTjLPVp+zENNd1XjDPdj43R3vOpGp2vB5ZbCvSqnUJ08GTW3ox/PvhV1CBng4xtlmNMO6YGDrWb8S8Mf7Gs2Vm753EItATFYPgM88PahsFmu4Vhh+VyAeu2ELV49vgdiCzxR9/5GNysQEtg29ygsRYb+wLKhNVygZUxuPnySxhjAHFwodBkVVVwrunm15kRwQD5BB0UzW1/365/8T1nlE7L8f8mDbOvBWaiWmBAV+iTor221NVdRACRnkaXtomPjWlu3fdBBETklPcCZYj4UjYi4u8hgKaxn6N/+Sh8Bi5w7c/4x8MvsWqOKUvsOFWG+sz4F4avVMiJdKCIAJXxGpjAAuQJaLtt8L0ffIbv/eBLkF6h2VRwDaOxPt/hj3/4LpbrLQQbkLGoagGxdBk9VIc1rGNJakacSjR7MmH/8PVmn4/not9NjpzU2pvxzwe/NHCuY3xsjJFzgGN9ZvzLwWcRnz1iaC8m/rs3wTYDuwvaGhPEeQjDjFc3DT7+7o/gGoZtKhi3xIKW+KOPP8W7j99GRQ7rhYEhhSEFk4BgwSpg2r2I2rpfCT583eJRGSCNOIC5vdaSE0juc6dhFQKWD5Gjkpt0BHaKa2/GPyP8qWw6ZLvMjZGqgneVGf+s8K++lpreSn/HhNjt7fsAwObG4cWLl1jWV3A2ZNJAjR992kCdweZGAa2xWtYABNY2Ea7XvFqT2F2lt/9V8Ly8TYHKQ50t2j5Tjk0ba38c9b7/ORf628qZrf0Z/5j4uQnkOpRsl6Vzh0xqxr84/OYjchoy/O1kKmn18vkxQcT5wN5ABt71XUBsfFsWOKewDbBaL/GPf/sTqHsAt3mIB9cPwVyjtRb6lE8CkTbPX0u0fU2Mgw52K3f05Dr3ApgLcWM9r8ekzEqu3lhJYu32GJrX/vemnww0v/C1P+MfE5+TA4dMqtSOsT/J9PMUu+eMf7b40lViLgXTjlUd3rUVH1xMrnN6aAOK64oh2EJki7o2qEwFu2X86NMtfv9bz/HyiwUqY0Dt9LSt3UWdo0U73li5kqL5r5TOohCsDWBQG8sSzoHmwuI4t5A4A0cbfA2h34uanNjam/HPCb/EpGOTGDouAxPJ2Udn/EvD5+onvdPBfoPYhTznodgDEq9dsVEwK6Au5EIksFEotiC2MBXAlSe15kaw5If43X/yQ/zxH1m8ePEKzgEEA+eAxiqYKoCqroDlrpzK7vKIBeBpJJB3NR8mkSFtVCJifV1yqGmyL/rbmYOnsfZm/LPCL51MB81trA2Bl9ql9tEZ/xLxGT9FSRmVobRGgxKClynKpcjGw1tr4aTB1brG5uZLbLZbPH70BDc3FioLfOs7P8Bnz1/CWgsi42OgxDuB5Pa/9uPRxqc3RY5RNfmYlZfvQl6erG3shXhaa2/GPyv8dNVzYWIlO+RtbaBDLD3jnzu+Wf03prr+t6AKY/rEkHrlgftOD7H4/Im7dJ7t3lFs+tvldL+diJZzNHrMftIJ3vMY9ETHzBDqx405EOq6AqOCiKAB9zJvtKbQLjg75GEUWFjrQC5ka+rmxaGfjyczYYtbwz2QqMZkNuFw8pnD1zvdtZ8AqDbNy1ydwXaCl732Z/yj4o+xaunYoRcwVQ2d8S8BX9Hk9rhuo0W0Tg9jCXO74Gjmo2ord5E0Gzxn7sldJBfIfGxJv0f1bBmvjdNaezP+WeEfYt9MBy6pjKX2ub5DbDzjnyt+yETPWSfY40uaE/CQpMG5NEw94hkp9zJl7CHJxsjJdO/Bkjnw2N6HRAQhQFk36RSS95e99mf8o+JPtUMOtZnSdgrbzviXgw9guJxH+v62kibALeU2zEmuPlkWA+W6ZURtLt886cRkNOV6pybxPbYMxY/F16YOXyTNTm3tzfhnhH/Xn8Bp/yFCPIS1Z/wzx/cpm0JtrSM+cHOJf9vjIj6+awph5DSXogt7q53dQhvzKat28WQld/wYf0r8VvHajhD4PDgnkjQG7OTW3ox/PvhjJkTOHIslZcsh9rwNa8/454ifCY66LYlNDcaNM62PtY/JK3VZL2pxB84/jvVKCVUGCLbLvlG4hje5v5clW6KcC/3prL0Z/6zwSyyaAyxtqE2ZwJR+M/7F4Our2xSvHJIxrQXApNiynOTirmK825o9D2m7P9cpz4LiYHfo2r/uvWtQ/fs46bU3458TfspyEp8sAB4ygdIFlSY0418G/nMOXoE5eR1aRMmBYxRrzy3+dumXsvt9SYhAO5eSN6I3g44HPx/r/g1dZ7FOGuv/itNeezP+GeFzBnzo/Vi70mSHfi7O+BeHr88l7EnF0pnQZD/HYPdwZupebcByOsYUT8O0SnGxbWLWS6U3z0JYQHc40lxEFOJ8Nn5jfHyYda6n7bUEH2s8zMHdnqudJTYxb8b3bzAFVmyKjLXL8F96j3IiInCkUEMAE7Dd/kZ7Kvmbkwtc+zP+MfE502hI/UvPD7Hr2Di5PjP+ReDTiyGAIeJR0d5r7/yAE8QYVqwBpebGu0h/iyiQEI8TbNqm1cCm7OMdW6akvdLdF3LCa2/GPyf8XIcSYw6xZU5dHGLe3IRm/MvB3xAJmPsP4pzGdZu8f7chsWOb33Zz6QENti2RZjYUoM+Kd53mrcUHhoevXbX9YXLKa2/GPyP8IUYdm1TuXE6VHGLVMdae8c8Tf1J+pxyJjbmax/0OkTet0QxJ2Vx3GDEfQw6JO1OV30hOneLam/HPCH+MNYeYNHeOM8dTps5hz/iXhb8AAAnP6bs8kEv7XVO9HHtBuNH71uX+rhKFiXVaU5v6auy62/iwdm5vWkaxJblvIv9D2iL8PaW1N+OfEX5OA8uphKW26echVi1d3Ix/cfhujYlyyF7Uscx/xyCukpTKwrR7W3GbVNMcchiJ5XXFgmWJLN6HrM3fCu9OeO3N+OeEn1PdUpUwN8GxCcX9D5UZ//zxq8LxQRnTqkpxWoeMDxxGmodKh8GUdcZ4Ewl4jyHZRMybTRvEfMprb8Y/I3yOXqWJ5NRAznwemlAqubFm/MvB951uGfSbc2o4JM1SOm7JieMYJNbzt4jIq99m2ny7LBwZeaNaV4S5w9UmOX2qa2/GPyP8XN2eHOuNTa5lzMEHVqH9jH9x+OYFwaCxAkauJMe+h52q7pGYqiIujAnsCtzRfnhTFiP34O8dC+18baxxs52A27JYECjABFUBEYNUgRADxkyAhFHDsFWYa7s3aNSPw6wQFQgJlATsAlmzj9nyLEkAmXBf+vewF28XxX0x2nuqAO3If7dlt68NxvemYsbGNqhR4WZ788PizenLha/9Gf+Y+Dn2LDFfbtCx82nbKe1n/HPHJ/7ucNPpciq1vaZKGiowhVSL3pYTCDVzYupUJwmhK4z56wPNTmftzfhnhT+mCuYGK7Uda5dj3LExZ/xzxKfmu6Vg3FKKovTcEBG0Yx9jD6nbD7vFg3+IYNKUUOlc02vvvBYTkutKuUz0ukzlLvfIBa1YVQHm/zY5fZprb8Y/K/wSy6WdSufGmDc3idINmPEvBd/ynrmpRDjpns/UpL1flRwzmW+7V9aliEqvsWD+TE2tU0IKbp3fkQlCBLjt/5icPs21N+OfFX5p8LEBh84jcy5uL8j3mfEvBp9sqcOhmlOp/bGz3R8se9rj2L/3fYm1tE77UgWRA2g4Fvw2138oiXnFy0DVKYBtcvpE196Mf074Uxh1jEnjSaVjHDLmjH8x+JR6rAEoP0BfZ1zW65BSjbA2+W6OdAeLaxZyPg7J4PnIMWbKWEPCzBDnPsW9WXsz/jnhDzFoabBDz8VyCN6Mf7b4WpVKhtwLibShW/Xt3vb3s5i9x+FOdlWrx8aaIlPv99Rhtc2kIvIrE5qfyNqb8c8Jf0ydS9+X2LY0Vno8VSHHxpnxzxv/zpLb4zmmE8ebklzm+T0ZIqBbxsEVhpkkRAxlBpT/VqHJKa+9Gf8M8KuogWQaSHRujGnH1MChdjP+ZeGLJNpH+h5oa2JNcz4YC/AderAPJQV2IYaKMW6yy11LPLSqAMTeb5AICDFsKgwPE66Xna8ZZsM9Yn/72QmUFXtTmeigkTbL54/cvx8l936iCjc3G2Chf2dvB8zLKa69Gf+M8EusmmPKEjtOlaE+M/5l4TNw3BiukufhXZ08em70udeIeLLi3udW2oTB6RzjdFPxNegIid5F9jOaRNcwEOzNzMB2OxQDBpzW2pvxzwi/NHCuY3xsjJFzgGN9ZvyLwdflAXOZLLdJ+jtkbjuKCbIwp55myQLi4czzu3MShj2M/KfUO4u39lKvyVy/RgkE82Vy+MTX3ox/TvhT2XTIdpkbI1UF7yoz/lnh6/p17VFNIbE3vTeWBjQPVX6WUGla3O62SUReRLwLHr7rvPZMgof2UwA21b5OfO3N+OeEn5tArkPJdlk6d8ikZvyLw+f3gPJeSyu3NTHGhFAyFU4l0K4uWOk1UTzxcIfdlk+J9+6IqNPMKDEf9rEU+xthQ9jDKaf6yYx38x0VFahKGsA8Jhe+9mf8Y+JzcuCQSZXaMfYnmX6eYvec8c8Vn/FR2ulY5FXqf2hxy9clbfJdT2LSZdggIhjjtSsOf+N5AegR4CGVkg+Vyd2IIcx/Ozpy+mtvxj8r/BKTjk1i6LgMTCRnH53xLw5fHwO7jPKvizSm7nWl59O0VHdx4ujmEpkRFdrbYzLMHWnF90ThoIWMG8e4Z6njRm++xVzA8QkCtl/+anTgHqy9Gf+c8Esn00FzG2tD4KV2qX10xr9EfOaHbyrV01eeamqAaJgZhhnEu30wVb8H5pzsa6Vt4t6jTU0HSWxUqFcD7H6svRn/rPDTyrhcmFhuErm2Q3bLsfFm/EvBF/lQXUsgbs9DLn6ocrJNWzI17u2nDUwgJyUy23OYSB/0bb+WBEZjsgRMBqYy0NYkKAoHAYXUFpUCKoATAhTgkI1DKWR/b69Ozd7c/Xvp3vtT7T3icC0EgaKifeLqf+TeJe5dCzXfjz7ej7U3458V/hirlo7lwIZkqho6418CvponOfNeKR4qltjp4CRSUbUOFiWTYiY4W6FdeZQxN35tySuYHMcy8R/bHDtoSnT2lycMcVprb8Y/K/xD7JvpwCWVsdQ+17d0I2b8c8Y3eJQ2yNX3OgmCOoYUrqMLZBZGmpbUO3a0pJX+3S+vcqfkviPTzjldes9I/u8mDHNaa2/GPyv8qXbIoTZT2k5h2xn/UvCJnuYIaqhI5bHlWJpKnB1jb86Fvbd0DntmvCT7fOt9uPu7wyml0HojsW7u1f8+odVprb0Z/6zwpzDokKT9hwjxENae8c8Zn+gBhewTYyR11ziutM8bl0y8GCHEe2U0rxKpxeQFGBCZCdADDiQTfxz0U0rt3ou4DYC4MOn9WHsz/lnhj5kQOXMslpQth9jzNqw9458jvtI1sNMecibDocS7t64ejOPvF/Xc49O5pbFobV5Eoi6hb46gxxITx81LRFRKYnwMrdZzsv4oOXw/1t6Mf1b4JRbNAebAcwNPYdsx4pzxzxmfZAXkPQpTEruzq3cG543KLrXF3inm/YBlEb/31e5/7c4JVADIrn2aceR1ivdRib8f+Vam2emvvRn/rPBTlpP4ZAHwkAmULqg0oRn/AvCJeC+Zb24/7K7E1Y7zWqX1PhxKLdVqQ20Ac/BEZKbulZM2hVWaWDeFGipJcxfZjxhotTqBqsYeiPdm7c3454VPSee7ym3GmvEvDH/x8Jk4awkAzEhgbinOa4oM1fk6ZHx/TtoP48A5ElGFqHeJZzIgZphq1cNQOI/Vudjb/PBo8yVWe9eTmkrjGLv4nKjCFMZvL7Hl5fZ9O4Z1FuLsvwDYvxN1uxdrb8Y/L/zcAEPqX3p+iF3Hxsn1mfHPH/8RqZKqouZxR4S7yLG0kdFxxtJLBRZgMmAyIQ7M7cW0EY/HuHV7biN7X8c2KYZ9LwCA4QqA/c2kyX1YezP+meHnOpQYMVUT4/c5dfGQDbsZ/1LwF4uPnAgMFDVNmeIJy0A+xI6ENCpEGdqrCpyzEKHwki6FlN8Hs1B1wVQneyZEJFpjaS9xiofnIdLCsCEF8N1w+P6svRn/7PCHGHVsUrlzgv1xhlh1jLVn/DPDX9Wrn2YFloYhchoEdpB5cmIi33jvrtOaos2rXCLjXnByLoYMO9xD4+TSa+SCplbKmhUHNSe2zXuz9mb888MfY82hJ8zYZlzabuziZvwLwF+v1v8GAJ8L0A0N/2ZkiLwmEUScpiI3VkR2Gv5jMjCmhjEMY7jzRmQTkvsSgYo5BvpmwpjIUseX22pYu89e+2v3v9pjovpFpvvJr70Z//zwcxpYTiUstU0/D7Fq6eJm/AvCX16tf45FQe7wB+yblNvUEwMw7I0Ir0WZymCxqKMu2jMh9rS3qBBm3L6d01AS4tK8c+fy3Mu9c11zdbkA5pNfezP++eHnfualKmFugmMTivsfKjP+meI/e/bswYPF1WNmRmMtzK2md8KSMy/2zIYMUxkYY2CY4Zz0X+JfqgIR66sy055aBIChmt8Hm2panNKGead19UydwPeiZvdi7c3454nP0as0kZwayJnPQxNKJTfWjH/m+FdXT/4rZsaiqrBtGuDgoif78rrjvA7yQEz6UWQ6BBBMhp68YuHgfdjtS4WMHZ2JsFAHbMyJ4y7Xtwtc5uQ4A0p/HE+/MPRJrb0Z/zzxq0znHOuNTa5lzKE+pfYz/oXgL2rz10gafLn5AqY20IpA0n+ApmmP9utV5euBpZLGQZWklL5q9156bffmE+5W6lCpkYOKDxZQkAiYfI0uZgZVNcQJGvHByhw0nTbgWbetq72CDUM7jcgGh48H/WsJcWQxsbX1wVQEAr/H5j0d4x/Jfq4Uezsq4JwDM8OqeEWSffya3W5iE+K9WHsz/nnipwUt0wbxxHKDjp0fmlyp/Yx/pvh1VT1ptluslkuIE1jngOQX/rHlK00jlZGuFIoInNhgMmzA4Z+1AQHEnvSqNuZLujRTPpGvgqjqeXG2xSuHCHtqAt9UMmMucM/W3ox/nvhjqqAUzpWeOkPtcow7NuaMf0b4y7qqbzab8ECkXnDsseW2DiLHSmFVGtuJQJzAWQdigTGKmgEyof6XOigcRJwnKFHAEUgYLAwWwKjBggyYpHtRV/gynnP0lafZRybuk/UzeUh7IdeZ5ie99mb888SPNbAS++XO5Y7nJJ5E7n2u7Yx/nvi8qCu8ePkSTWOhOk4yb0J7etMamk/F5AKJNKgIUFYYAQQ+ZZU4T1xEBIX/693rw61nAhXuX9+DsX8ubs9xnqjDJbf1kMoprb0Z/0zxq+RkTmUbGnBoUvG5tH+uz4x/xvgfffST/6IqYDcN1AmY/H6MuyN/DMU75fasvkpJ99jsq1eQsK9kiEBQX2LWWxE9yYh6TVWkc6oQRxCnMLXbx4gLbKLvqZhqaUrtXtmhV9J5odyLtTfjny/+FEaN2ROZ9xJ9Tsc4ZMwZ/4zxl1X17796eQMAqIwB8y4TR+pNNxZcfMz4sTcZi5aaJ0UEKg6kFuws2CkIfh+M1WtZLCG1lHOwrgFcA4hFFcyM6sT/jYKXc8HN8RzuLrJt3+AerL0Z/3zxc04cJSmBjJ2LZYixZ/wzxlein91sX3aTADPcvgJR7j+SXf0uRHSXjPdTJTd2ZSoYBVjZh3uRBCcORVV5EqrqGkKAWkGjDrAKJoEhoIGAlL0LZPgGFOh+l8bpqtJrnHK/duRHUPXJhkPn70SK3smvvRn/fPH5blGDAAAgAElEQVRzBFayWcZMmxuwNMFUPSypizP+GeOvF+bZy1cNVATWKkxNIDIoxYK1D90xbeyYpPMmiCwWFgWBwApvQiTGgg1MDSwIWNQ1VjWDKgNpLL7Y3GDz5RYb2XjHDvIO+t6F30EZUGGoOAAEY8xRtC//XcRH6NP0UnDCa2/GP1/8KtM4bhCDjrHnmBo41G7GP2P8999//6oyFX/2w8+wXC7w0m78r/vuB/1+LNZtk9UeIwN7fz4H/Gg8gCBUAVKCFYf1gxXUOcA2qGsDA8WqNljUhOvlEqvrGjVXeBeKm5c3+NGLz/DF85dgNdg2Dk4EhmoIyH9RChgmH6YQpOdyrxrcRdrrzF9jv24aIMpgXwJnmzQ92bU34583fhU1Hhu0xI5TZajPjH/G+FfLq3/Tbhs45x0RlAGlypMOTTcB3kaDyFV6Hjr/poQIYKpQEYWUWgIQowJQsaImRsVAbQSLymC9YMAAD5ZrrK8IN9crfPK8wZdfbnBzs4GDBQmgypDdL4MjzXVvnAe5dgNysWt/xn+9+KU9sFzjQy4gB3jIRc/4Z4Rf1eavS8ge4SKNZiuACTUtc+Q0LRYrncrYQzupF0KHbAMfV1gd1nWNVW3gYGFVwz4YwCSombEwwMIoaiKQIVQVo16s4JYMZeBz8wKfQ/By62BDyikuBIfT3r0cXxJtTbPk6LOhy8IJrb0Z/7zxp/7rHbJd5i5KCu9vKzP+PcZn0J+yTUtgDZQYbqJycKx9qWz/Wya9PdYeGavF1XKFq6WBVhW22wakDoYYNSvWNaOuDSoWqFioFTglABZQhwdXVxDrYLcNgBu8agREGojQ+L/HlPYHheKD9hJw4mtvxj9v/NxPtfhYqWPc7jaTzP9EnPHPEl/d9q3tdhvy94Xm7Gte5cqWlEqATK003MMe0OLelPmwjL/B+opw/aDCw+slrh8ssVwSqlqxXDDqusKiIhgYVCSAU0AErlHIVgDXoGLFYlFjsah7SYJlgLwYAs58bUTis4HsHU/HpdaEePJrb8Y/b3xODhwyqVI7xv4k0885Jp/xzxR/WS+MqnprHTEE3nvQRa1yRHOUeLC2nEmSJPg25HWb9FI6kHG/MooHqwrXS2C9JDxYGSxqxlVdYVkRDIv3UAwByBURSCsYNYAw7LYBq0PFQMWMZU2owCBSGFIcI9t//qL0pnDm5NbejH/e+CUmHZvE0PEhmycX3s/4Z4r/4Ycf/vOmUlhtfIe42vAd3LoPJpPE0/HQ/r22GVK8jbz9uMbjxwusVgb1krBeV1gvDBZL01VpBgBtcyGq8dn7haDWzyNN6GuMAfe4+TaOL14TS1NSKaS9Zot7sPZm/PPHL50s2TWnsmmpXWofnfHPHP/B1fo/2GwtXr58hW3TQFTBTBAuJ5RN3ervlGB3YuLakuxhHnFf6e0nj/Dk4TVWdYVlbbBaGFwtvRZmKsKSKxg2XRZ5dQRRQERh7a4AprUWzjqIC1nrQymUY0g+g72+xD1YezP++eOnThxcmFhuErm2Q3bLsfFm/DPEd7b5+cqs4GyNCjWsADUbGAdfUqTbc2mJgTqO8HWzKJQRGTcppmSTMxXujyHZ47mMH92k4vGCN0pr5mvFhipgogxVi6tlhVc3X6I2Dgsorq9W+PDpWzAiqAyjhoE0QL2+goh4zYoFxAIYgqhAsfWEJRZgiy9fMbZbi03jIKpwTCFTB0BVBSv+uqS9xnA9jgAVX9nZe21KuBP+GdHujxGFWDImMDPUWhhj4KAvMl/Bya29Gf/88VMCy4HnjuXAhqTUPj0+458ZfmXMO9vtBi4qoCjiH6ltHNglyGa7RWU8mRET3nv2DhZ1jQoMGIISw5KDcw7W+VIqVajxBfiAahGfyd5Zh8ZaiFRB4/L7XUYUjnwMmZCBkoMKIzUjxul+p0i/SKYA0I8PuPSLXfsz/uvHP8S+mQ5cUhlL7XN9Szdixj8D/LfffvuRAdM2uNAbJlTGQABYqDcjYlizarWvY8jtY83uBAoQwTmLqqpATrFeLfDhu0+xqBjLirAwNZZ1hVVdY1XXWFYVFoa77PNwBLEEaxWuUTSNwFmFNqEgpvhil8QENgxjDKqqfRHqioKjB2BIYUAwPE5eSuiypewSLwuA6rdCk5NdezP+ZeCPBTJPmdiUtlPYdsY/M/zHjx//WSZC60IPAEoEFfElQ4gmbym9ljiwRF6HWz0Hhwg2BkYVQoT33n6MB+srrEhQEYMMwwnDsgNHpC7izZKtSbF9tYUxVRnsdsUsiYCFgf9kPHc6wyF1lEKg3bd1qAMLkQFzS/b698Kpk117M/5l4N81DUE6uZK6KNG5Q1XQGf+e4huif11UsQkE5kQhJHDOQQxnf2qlaaXeBHG9DjEB1oVKxhUDYje4Whh88O47YBWsVxUqNn6PyxKcY1jrk/uSAk0Dv7cVvA2lAZwFGqdwAii1xEUwHGeiZwgRDMF7Kip1ZkNhQEeKsKmGb6bVvoi8a76pYW3zObD5XZz42pvxLwN/zITImWPp5IY+585NZe0Z/57jG6P/nKqiaSyICK0zAYgK3m0HyjHIaWCMKeTHA9fizaYAhwBuVcWzx4/wzluPULGgNt7L0CijMj4Hojf/cVczra2c7JyDFb9HJiKwztcAI6Mw7HGMAWr2WTyMSogHA5hDnbAJJtt0/jtnFkZdLUBw/0s4fdJrb8a/DPz0RGqfHFP9cgNPsY+OEeeMfwb4NVffFOcdDijKEmGYvVfbiHu6HiHWalAyY/OEvaG+CHK3pjOZinQefOuFwYc/9i5qAhaVAWsoZqkOZAVG4asyq4IR9raCuVCcwKlAyGuyqgSo18AMESolb44kBjOhIkEFH9hsCKhIQAJwmKr3QizMPdr7AoI3JwhUMZzo/9TeqszNOJm1N+NfBn7KchKfLAAeMoHSBZUmNOOfET4Z82jbNGis62KWWq85DVpFT0pklbjGH0WOHNtVmpc6i7oiMByurpZ49+0nsG6LJRNUQmwbFGB/b7zm5N3/nUqnccX3roeL0N5IMCUqWAmAgo36/Tfmnval2B+nfF3+axWw94hk+U6m2cmtvRn/MvA5Az70fqxdabJDquOMf6b47mbLz1+8wNVqDSB6yBuGssAsIi0sytDReQaq+nyJcVaKJCardzzJkFE0laVxXdE4sdfjbeqRte9bEqqqCnbTYEGMD959iqUBSAXGAHa7gVoLcp50mE0XdyaqWJABq09HpWEfrB27qvrZOpi5MxUaw1hWNWpQlx9RnOyIcIJnpyfFGlYFYO9oIiBBVbXFLE967c34l4HPmUZD6l96fohdx8bJ9ZnxzwT/a1/72p9crVYQ6WfRcHR4KqfX7ur+GsU1DZaLBaqa8M6jh3D2BlcVQ+0NOCJs5xwa23iNK1xrq6m2mloqcbB1+2ISgAQSiM4AUHW3S58FBZOBhqBsIqN4tfwinD7ZtTfjXw5+rkOJMYfYMqcuDjFvbkIz/hnhP1yt/qZzzqc5krSL/zzlYTolB2GnKcUa09D+WZte6g1lo69I8PbDh7i+XoLUgSHgsH+lqmjEoXEWzjVoGgvnYpd59DQmVQXBv/ylkA9NSLKOtH0k3IfY/KjKgE57xlSVd1Rmr9l5W6eXk117M/7l4A8x6tikcudyquTQv5Qx1p7x7yn+Yln9y03jqzCXiOrWeQ2/oirKt5G6qrBtGnz9a+/CiGBZVVC7BcRBoLDiSd5a5/cKnd8vFJHguRiXOJGeybRUYqbd59JQuqbVgj0hUhfXNSaqAjbha1YDYmY8EcaJr70Z/3Lwx1hziElz5zhzPGXqHPaMf2b4DHpPrAWFh2j8kG3f6wSPv9I+VLEkyomQG5EDkS91UhPw1qNHgAgMFK7xhSutcnj54GMHRtPGfKlAWfw9CkHfTARuNVgSCBkImWzy407r6gU++5gyJYJOsPIQ7dz4mUNlZpHcGgNOaO3N+JeDn9PAciphqW36eYhVSxc3458hvlHhdg+nwn6s1NSKzMA+iWUf2P0G0wd/zeJE8PStJ74wpSFsbeM9DN3OhAjsXxNEoSJQtSEblfR/BIB6ThxtP588uHW/VzQiEAGs+jKWAAE6rn35OTEQNDWtGE6IIHvJD05u7c34l4Of+xmWqoS5CY5NKO5/qMz49xz/gw8++GbFBlWu4Hf7wIZ2cUxDMlrosrTXtcuCe5TaXSXxLg7DY7/99kNfFoUZ4iy8P9/OsUJIYaFwEFj1+2Fb2ZkS0wz7TOSTZDD5mC0mCLwGJ9g5frR9ex6SbfsJHF8Z04KiMsbvZTLbpNlJrb0Z/7LwOXqVJpJTAznzeWhCqeTGmvHPBH+5rH7RisOm2RWxBOK9mQMJJUNCnVddQh490+IJaGKVMbharbFYGDjnYIzpeQT6rBrBxT14IlprIW6XdSMlMY41sTierBvTn7PwzhwOBIChdFhoQLv/peS1PREBni+3OOG1N+NfFn6V6ZxjvbHJtYw51KfUfsY/M/xFs/3Xrh4/xMc/fA5rVmiEoWh8sll4LaBxCwgbALvq9CoZyChOLCdtoO2u+Yg5cUhbQ9+kF9ciK42hEBAxhBiiBFGGIQKrj/H6xrO38G7tUN18DmILhkKZ4KgKe10KE1JDwQq4EZAVqBMwh9g4BhSMDTvA+YKV0poZnUCU4JyBkEIE2BDBEeEGgCVga6Vz6PAjBSVKHYxhiAuOHcZAHMEZBdMSi/oaL16+hJKBcA0rrxzw/Rvs/yI+mbU3418Wfo49S8yXG3TsfNp2SvsZ/57js7o/mSWjMTkBjem2QpHJUuFARFiywXpVo66q4BqvXWBxLjNJz7MwcXCJs5Z2LvKRibDVbG0vzu5219E52QBgU8GYpc9laV0DtOx3mmtvxr8s/DFVMDdYqe1Yuxzjjo05499D/Jr5MTGPZ3zQzHQOJbFCgG/RS3FE4j7FWmQj47IoSAFm4OFqhaqq0Mimq6nlROCchYQ6Xjsi6psKu70sah07uKsA3Z2P9rhye4VD30Fs2k3OoKr8/tdyUftAbGKIayxOfO3N+JeFX2K5tFPp3Bjz5iZRugEz/hng/8RP/MTqerUgAHAhY3r7zJ2cgf4IJHbo2DERTCK+JAVVq3Hu9qcUJIqrqwWIvLmP1ZNX0+zX+YoJLSYejQKOY6JqNa6OfFTheHc7nMKXUSmQ2/7l9LL3eg9H+FRYbTBzcqNPbu3N+JeHXxp8bMCh88ici9tLoc+Mfwb4V9L8fFVXvvyHc8GBwD8gJXIi8LWsBv4NHMmcOImM7hBorYbgQr5CAGAOJKgKJ42v96UCsCc26wSNswBVwXzoIOI86Tgf/9Vlnnc7Bw0R2uVEZF/RuvWBDBcKTvcDJSG50jWE7PPxvfIJgD0h+0KWAvhrPNm1N+NfHv4URh1j0nhS6RiHjDnjnwG+Mfi3DQibbdN7cBYrzw3JkTS2PRLLtT9WthC0Qczq63KxQtWhhoJ4V2U5xYi1KkHIfyghIFl2mlTrJr83BgGigDqCVQqkmPfS7PWTvtbpSKDRl6VApxUGOdm1N+NfHv4hj5UhlXFMncyBHyoz/j3Ar4l+gdlgs93uMrwXyWHqtAckQ0YHJa4dMCmWu0T7ZC4KLIaApAFEULNiuTCoCCAJGqiIz4XI3MsPuUcqhqHV/lelQnBkIMoQZTioJy7wzoVedWeKRNl8mMaWAYCAeiEOfhwXf3+5m3Uya2/Gvzz8MXUufV9i29JY6fFUhRwbZ8a/Z/jrip4YVjjbumoPlyc5Wn2vEbmVFlZwEGn/UkizBAru7kQhXM1XSF4vahD5qskKAVwTyp14F3o/xu4WE4LzCfYdUBSAy6TekqCdqQIQDg4f3uNxJL46XCKH62kzdQDt16uBDCNhnPDam/EvD58zjUs2y9T+mMqYGjjUbsY/A/xvfvDBz61r9jFNCL/yqZ9GykFh90K1yiQW1wPrtZsYDF3UxiLnhzCJHqlR+GzMDnso96JhBlRBpLha1ni12eCDrz2DbTZwm1dg7OqdOafRfpfbOVok5kEhv9fVhKz+NgQ2WwFECY1Tv1cWudNLRDqtBhbPPXZUEfjgZmb2DjdiwVx17ZrG4ssvPodhRmMtoFr6or7ytTfjXyZ+iVVzg5bYcaoM9ZnxzwB/afCfAgAHc1nrNi6E3r7KIVIkoIRwbi3JOKk3YqyBxHOJvf+gCuscSH3yXlaLh7XBsiYQnLchqo0yZTiIeC21LZkCeA0MQM/DULqcT7yHvyNUgg1kJy6UYFHa7aON34Twfw73w3S1ykC+EjNT5+Vxkmtvxr9M/NLAuY7xsTG7Zw5wqq10xr+n+IbcX2ofrCISHsi7ITyHCYh9iRA6aEpIHtrHkTgAOdXqmPvElpuPsIGw6WK42DAau8XDB1dY1ASjDqQ74xwC+VhVqHNALl+heiLqPmMX7OwEsCF3YqtZWcKuBIsIRBysSvjZesDzhnwFZ8MM5qBJ095SOsm1N+NfJv7U1T1ku8yNkaqCd5UZ/x7gPzD8qGbv1t3YNOfrLSVjKrxLoPL+8CMu5hltK93XS/etnHN4eLVCbQzYAMzetNiNGcqU9PIXqiQegwZd0UllCFNIVaU99/jOQ1AYIgqrDAcOYw3/807NihyIqzse9uwa60MiaN9mezJrb8a/TPzcBHIdhmyXt5nk0L+sGf8e4n/47rv/0nq1QF1VgAiaxhPYlKznX6m0hNSaEiNiLGbiaPvBP/w56idNA8PA9dUCxuycNFrvvtajj2hHFL5w5Y4sKRPT1Y7hx2GoEBpVNGlAc2jn3LRloaqQKEZvLzsHMVxjYRsLdKHSp7X2ZvzLxU8X5CGTKrVj7E8y/TzF7jnj3yP8h1fL/8wQw9TcZVbvqvkKQ/mW+2CZva6D3OQPguo7OwwmBo4ycLQu8cx+n+r6aomHV0ssiL3noajfA4PrzT2Px3tQXvtK9+Kwy6XoyLeZUGV57Np7WhmxL6PiHJxtoLsbclJrb8a/XPwSk45NYui4DEwkZx+d8c8A/6qq/owJ6YdasxZnw4ZuL0R0dNKKCTJHLln3+4TIujRSrFCyePzwARaLRcg20jbbeTO23oKttNqXxS4Zbyxxsl9L+04cGqolx3F1U9J2OdLuJywFsjKV2fO8dNIA2oCI4ijsk1l7M/7l4pdOpoPmNtaGwEvtUvvojH8m+I/Wq7VhAzYcnA2kF6x7WykSSTDJxedzr8ky4MQxNE7rrecdU3y7h8s1DHtHFgbAJL7ECnOvlpeH3c+/2N6/VNNs2gwd6mO94rHiPIpjknWrh8+Az1HIgoasISoSzKzYRMOczNqb8S8XP1cePDex3CRybYfslmPjzfj3FP9PvPfsb1zTDWpaY4k1YLegrcFyAQg72EogUDhSWCVUACqxWACwqPtoQ2Y7RA/6AVIpPcT75rEkpiwjIgrqzHJ9E14rVg1AClgLJoe1CL72oMbCbVE5C6lqOBg0ykDQX2raomJFo7WvI0YG1lmotHtiBgKfM1EVUAeIDSmlhCBEUCY01oa4LwpmW4UTXy9s6D60DQgVKq7hxGGxWKJa1Hj16gZvPbzC589f4NoIYL+EWgURY7vdfBFGOJm1N+NfNv4Yq5aO5cCGZKoaOuPfQ/zlqvr3TNgr2Ww2eHlzA0b0AI0epKY4lbyksU+lVywljem2+2ZjfYy2DhmCq1UFZgPOZNOIeniHj84pIxNrJrqLxQIgyp3XYbvH2J2bFOu1LxTc5okMqsp0cXuNtXChyKZ1Lgr6xo9wYmtvxr9s/EPsm+nAJZWx1D7Xt3QjZvx7hL+A+2ljKhhjoIZx02xhjIF1bUJZ6l4xRBuke6d9rcgbMJZeqqfc+KXje82G2xAEZHZu8o8ePICpCIYYzDuninZ/akdqJvL089WfUzNiL7uGtibFoG1JyFbvyvdw1Lwa7aMxM5pmA1GLm80WzjWw1u7Ku6gCKt/Cia29Gf+y8afaIYfaTGk7hW1n/HuK/2CBRwC6OKJt4+OHHLzWQJnRRknrkEwbBRLLtdl7f0dRFbD68imkFo+vVruchiPzj+cb51hsCcM5ByeKxiocFKLcueun3ouq5LPRF7M95edOgchVFdvtFuIctputTy0VmU2FAKj+g/Zj8ndIznrtz/hfLf5h9px9SfsPEeIhrD3j3xP8f+qDZ391XS+g4iCwaKzFi1c3EFJUJmggqlBh/wIFd3qCpl6FkUZyipIzQbIvOAKFzzK/Xq989g0W+E0v2R+DfA8hTwwKhVNPUjY4anQu8rIrswLA1+2CAamBI++BaJVgVSGku9hnHf+aidh7Q5KDcw2cs1AVOLFdLFr/q5D/o3fpfbm4tT/jf/X4YyZEzhyLJWXLIfa8DWvP+CeO/9bV4j9koxA4kDEhI7vCApAoFRMnAxwrk0Yqxb2xTAzXoeOVxMBrmdeLGutFlMkicmuPs86riH8Fs6ALe1reLOgT9ramQU+BnuCUdkHKEsaW4JXo8doCmNOeE23cmgHB2tjlv/VGjN3pIYD9naj7V772ZvwZv8SiOcAceG7gKWw7Rpwz/j3Bv9bm50W8S7dhwlYFyj7GKJZd6qOQH1GNfx1DhgipZIo8xEQ5IAYKJoCM4Gq9Rl0vUBkDFkXn7af+BaBHWj1SU+3iyZQJMAQXApilu3dBKyOFVYFT7ipex34cbYXlkhBJ93Ju651FnIUhBkRBTL78C3pmTgvge9EwX/nam/Fn/JTlJD5ZADxkAqULKk1oxr9n+OtKryo2YGJsncOLL19iYxvv0UY+lVKcUJYUxQKXvkE+3qv4KpFQxknjdWh9RAQGYQHGul6igk+GC1C3g5QSVUtIzN55o43nasutcNCAnPXlUqyI3/8CdvkRe5c6nvcwJ20ORsDnbyTinalSNZCtf0/AZgDkItf+jP/V41dR5xLjDamK6XsunB9SHWf8e4r/jR//+i8acairCtumAS8qWBWoYTBqbJ2Dts4JGvZuyAf8upTEUpf7TLzXXiaOESKM29PQOKnozn2h1WzSAGTfTGEgaFyDigVPnz6CkgBOUNVApQYqAhsSWJAxkXkREFE01oJgYIzxrushca6PHd7N3WttDlaALRTK7PfKnKJpXet1F7fmM3V4Ii1+/U5g2MA5C2aCwIENeccUZnAgS0uCBdMXOKG1N+PP+PEA6aBDMsSQMnCuJDP+PcVfcfWfExOYqu7B6ZwLGoYEZ4W2XMnhGsJdJc03GB8Pb46A4WAArJYL1GzAAoiqd4iIMpF4EpKIlNBznW9NiCIEhU/S6/0AGYAJZsHW5EqFOl+H32OecAuYDJx1n+KE1t6MP+OXOpQYM1UT4/c5dXGIeXMTmvHvGf6DyvwzNSqQ+orEooSbxvm9mdRSF/ZcOpDggfemZY+8JpDYUF5BgoOpFFerBSpDMAywNhCxEFggSjHVwu3MdPHeoKB1XFfex+tKtbD3HPR+jwSXmZvPLk/hHg9pqdHm3OANYDix38YJrb0Zf8ZPB8kNODSp3DnB/jhDrDrG2jP+ieK///bbHz5ZmBpASIHEsAq8bDawpIeT0y29BI8a04X9sVryKmpxAColXNVLVAR47qHEZMnd/lIvDZWzEHHeA9G5rgQKEYFC5g0b3OsFDInCNjXKe+jd7HlvjlOlxGFt1vtQu+wfRacueu3P+KeDP8aaQ0yaO8eZ4ylT57Bn/HuGv14v/5PKAKQmZIZwaKxgs238A08IanYPVKP+hWDyJhIoJ8Pf1jNwgMQmudXH7TMkNiTk9SDUCwZIwKyoK0IFBmusecXXaqDgyBfFV2COHSjiZL7tMVHvTm+J4dh4EhMf4LyDOsSMuPsu2vfxV96bs+CXk46pXMzan/FPBz+ngeVUwlLb9PMQq5Yubsa/h/hXpH+NXTCPWYVYglXBTbP1AcpMg/W/jm4+vI0mFpv2UuKKHCjGNBtmxrqqwRLaY1fI0g/Vv9VtAcuYryWYEUWliwtrgmblVMK5XZ5EDWbEPjkfQl7JNWSO7fbnLADz9wpNL27tz/ing59bt6lKmJvg2ITi/ofKjH8P8B8vzY9BHRbBrKUqcBZotg5MvsjBkN9Gmx3xqHIIiWXc7IckR2SiCiN+/2+9XnfJdxUKEZe4pPe9IVvzXKyFteQkImhCsl6fS1I7rayLBVOFOurySQKAkPb2vEqJj9vYsrK0mhnBp0x0Crz6ODqZNs4NcLZrf8Y/HXyOXqWJ5NRAznwemlAqubFm/HuC/97Tpz/7YL0iH8sUJ6wND0nuu7C/USnEfvXIJ9o7OoZUlcGirlEZfxtFQlIo7eeBbAlhN42WtHaNKPZMRJ8A3/T97OqCOXkeHb7otT/jnxZ+lemcY72xybWMOdSn1H7Gv2f4teF/175yuFqv8DlegOsaQgu8+uwVFDVgDXwgk/eGAwAl8eWwFFAA3Loplh7KGbPd5Biw+GJ4V/AxR6qWDUgVTA5G1O9jacglqARLAtUaIICUARIYBSpSAIRKLX7s8Qq1vkRFNSoBiA1qw3DsoOrg9U2GKOAEgFS+WCQ5MBMsK5wwrFpYJ9iowLFBowIrio0A1gXPQmGQIxhVvAoFJ7tEwLGmN3BPNHzFkng77rYkCQBBmCHqoEzfRlS9JRnuotb+jH9a+Dn2LDFfbtCx82nbKe1n/BPHf7iofpHYO260ZjPrHBprJzlKjMoRs2W0lYqBiADD5lO8T9UipnFRBAJzID/e1+bqClguahhTZffK4vuRmhTbTBfxOWnnjH0TIBKnjtctrelSRX8lc/oi1/6Mf1r4Y6pgbrBS27F2OcYdG3PGP0H8x6vVuzUbGFKwqSHMaESwdQ1sxxHUi59i73e3j/CaM89r4s3Xzq19lW5kOj9VBZOCWQOhCQCHqwVhVdVd5v3YYUOtdH1VvYYE6x01VBRQ4701Y1Jq97ygvbl3mel1lxPxtnJISq2A839Hhy567c/4p4VfYrm0U+ncGPPmJlG6ATP+PcB//913f6EyAOg3WOMAACAASURBVLGgripwVLixCRnNfVqjcmXkPXnd5VNGHvak8Ml3c+eIeg4PXUBxIONlvUBdG9TYER05BVxLSnHl5cjhAi0RRa70IVZMgOAeT8HpAt1YXf+MZjdFbhUr5uSXwruLXvsz/unhlwYfG3DoPDLn4vZS6DPj3wP8R9fL/6hSYFnVYFUIGygxlCs00O6Bf7CDRCH34a0kNWNmgpDbh34ulVIc2NtqRaKJOS8Mfb1cYlnXPhu/Ui/2Kxf8rInru9eydkHOnTu9eC3Nkt8zdPEYmblMkUPvpw8HgALb3wyHLnrtz/inhz+FUceYNJ5UOsYhY8749wB/zeYvGVYYU8M6C2rLeYhg2zQwXGHYhWBAbkNYd9De+g9/ijIr+duiBEhLSL2A4gYGQGUMHl8vsSDyzh0QmArgQOTc/fMy/f2vbk8OPghZFQ4MEUajgDqGI0ID6trsJm12Gt3g9fTlDln4XyWfL3btz/inhz/EoKXBDj0XyyF4M/4J4tdoVjUYJA6GDUCMxhFebSxuNq6396WqUQaOdgIKM0E7O+iBezQTZKhVljtjFGAJXoV+fnXNuFrVMCRQK2AQKpDX2NraXp1mJd0eFkShjcCBIGC4YCpEoqFJqMzcOm9Y9RWb/Wv6Nd+WvBQKInyKE1l7M/6MP2XQEtsxymxbGis9nqqQY+PM+CeE//X33vvLrXnt1XaLuq4hhiDiPRAbayEMkPE0NRws+5rlAGyTNBWgKwPTChHBgDz5isCQwjDDBOcN0QaiDRD2tsT6ysoCdDW39s2HHGWVN7BEgDCEGOJotzcmClWKTI20d29fh1eiiIOI/AOcwNqb8Wf8XL8qaiCZBhKdG2PaMTVwqN2Mfw/w16vFv9O6pNeLGmCGFeCLV1uoMVjUS3y5FZAhMPkciW0GempNaNQ+bDNrvpe1feCBnMaDDeVQjF3nC8Jtf9XyTRaF1Rus6xoCh5vNKzx76yGulzUWFXvNSwTWWbAx3XX7+xXvixkIWwgpVAjWCl7aBk4EDbyjRkt01jpvxmSftwQOHXExEeyYc8ptk/sGL0XrFCr42ziBtTfjz/g5KbFqjilL7DhVhvrM+PcAvwb9+coY8GIJJYOXTtA0ApDBzXYLG3keSjB9TZLbJvFtpXXlGxp/QNqY6lzZFMMMBLOoAQFwIBWsa8bVogbxzsWCte+irwwwe09NCHvNyUkvcW83BwEg7PfCHMES4FPbG+9ur6ZH/K9Du03j1JgZEPM/4wTW3ow/4+fGKg2c6xgfG2PkHOBYnxn/xPEXdfUhMUOJ0MDX/wIZLJcr3Gyazs1bJ2g9nRzThT5HZAeMLxQ0xCTdE1RB0vg2jQOJw7Kq8HBVw6h6/mXPN2R8nFjXv63NxZ4oLe/uj1WCVfLu8th5Iua8C72jh89G71S9RvYaZEdiABMr8PK7OIG1N+PP+Dn8qWw6ZLvMjZGqgneVGf8rxn/27NmDJdeVMqFReMeDqvZOG7XBK2d9AcXIQYOZb7c3swuOut1sb9HPIV/3S7oMGN4MKiIQZ3G1MFjVi7A3ti/tON7MR/1A5JDRow1IbsnLqj9mKST6DWVXJAQ7t0HPr3trsSMxca9wAmtvxp/xS/i5CeQ6lGyXpXOHTGrGvwf4qvozWxU4GGxU8co5vHKCT794gRcvNtjeOKj49ExCVW7c6dKaFF9jKqqdmW+XlcKFHIAAQcILAMAMIqA2BjUxFsbgernGalGBjIBIQSwgI+Awbuzf22aJd+rNhyKCBgongGhEZF0M2M770Knvb1WK7vO3ldJYbdJhgXwHJ7D2ZvwZv4Q/5sQxJKV2uYtLVb8ck8/4J4z/8sXNX/mjzQ9Q1YBRQeO2AHz2dDY1GusgaqCm8pG3ISjXIGSniMYiCtG5wM4J465ywBh7Whb564BTOBB6Ka9Uw97X7jqWVYXr1RKLUGkZ8Jkz0r5WFcrwSXyDR6ETn6BXQyVmf99CaRQIRAhOBep8kl9VeWOaV5cUuE015fT/LDS9qLU/458ufpUeKICWbJ+540OTiNsPTXzGPzF86+QXHDtYZ0PBRe855x96N6jqFZyL3L4hIG2zpGM/tjl4/QHIegrGdbMGpUBcpf4peTlgzwQoIT7LDyBAMPcJESp1WJgaD1YrGOqP3eZBVEYvgbBzQbNCm2kjJi+BWHgtjNp7t6sVJuK/CNXoJraGE3W4q6hq757ETiji3H+PE1h7M/6MXxqvpM6VJpa2z4EPtUuZeMa/J/jO2T+3EcW2aXCz3cIxUC1rGGY4AepV7VuqQtXrIjXtD7+XXglR2inVbJupkq39NUG6NE25u8GMyhgQcZddY7mssFouUFX5DPSttO7wEioqAwBMv95XW10ZQK84ZTeGIsrc8XpVsOT+KWD/P5zA2pvxZ/zSuOlmRY7tSmw5xMBTmXiMfWf8E8F/S119LRuICmrDuFqtUVUV/nCzwaJW3Lzc+KS4qmAQnCi4YjRuEbaVxHvzqfgceybAuOihnZABM/myYqmmlmnrT2ce8Il2l2ocdTjNstNmFIBwyFHIFW7cBoYZ4m6g1ODDpw9xXX2Ga6pRbQFmDmNyl8cQSqiwgLEW7BiuMWjUwVnC1hkoFmggaFTgiCEEbCEQGDjj3eoF5OuohcS+0n41B2heXc7HoLV1RAqgqhXWWhizhDGMer3Gzc3W41r3AsCLaKiLXfsz/unipwSWA88dK6l1JZmqhs74J4j/6Pr6r769XOCqqvDowQrXiyVWqyXWqxWeNA4ff/IJvvejF2hUYMK+kKiiaRqAoyVG1OVOPNbW15CQz0S7J32i22+x00KiApisUKtYrwyqOsR2AV0mjpz7e/xZGYDbHbPOgYjBRG3i+p35lQnOCZQNBPvj3kbi/swcCK2BMQZ1XUXzFYgSnNv8AU5g7c34M/5Qv5K72NgkJWoz5YLSibZ9Sv1m/BPCf++th//1u1dLLMB45+1HuF6uYIhwfXUN4gqffP/7sM51pKSqIGaoeM+5XIBwW75kKJ5JCiVOepLRytI9nV3Tw0mA1IFgYNSBSfDk+hqLxQKLugKRwLAPMHZBK/J5DdHlLxSVkAZq52VogyfiLiVUCP6OXO5V4TNxaLsflifawblnsuEDnsDqqkLjGhjDqCqDprFwznV7bSr67cKwF7X2Z/zTxi8R2BSGzal2JZnCtjP+CeK///77Vx89fesbi0qxgGBVE0AWqgQnXsN68XIDEZ8myYUHMxsDqipYp4HEEIiMJpkCs04YE1W2XbkTmkha4ucVaWMkPqCZiHzeQyiMMXjy4AGulzWWNXelU4gIhg2cOD9G8DaU1j2f/D6WuDYDfewyL8E8GO1zSQXAepKDQpJva+p1pfehp4UZBhw6L8rG2nbqYMNgxvelbKm8iLU/458+fmkjbaqk/Yc25kqbfDP+CeMb4F9larCqgYfrJQCBikW9IBAprDI2zqEyBswMwxzMUCEdEQmYJBqvUJn5UGnd9AZixkpaS/8Vt2njwLywiicuCFgdrpYV1tcLGGNgwr6XFUDBIK6AEP/mROCC+TLNruFAABOEDUTZl1Oh/XZd7bCCA8cUR5W4T669CAHKnSNJ/BLF90aGP/u1P+OfPn5pwBxgrm3KlmOq31ibGf/E8B8u+W9CGkAdKiNQtQB82RRigbMOzdanWbLW+k4hA4drVQfamchetyddR2ztqyDMBOYk7ik7nEKdgNTh0XqFq8qAo5iu9m8cjNz1U4WDgQpBHHlNTHf5DIlj8yZ87Jf6JL4+ka52OQ8pMY/eyhya8dJsCbIL7FaBOAdY/bX4dmWGO/u1P+OfPn6JRXOAOfDcwFPYdow4Z/wTwX9Umz+7WtRYGEAa11UdbqzfM/n8xUtsG/FedCGdFJhA5MAsg2a/OxRZ3EmOsDJaWfrgFtmldvJpnHwmDqEKQlXX3sCTlyHBOw8foDY1DClUANh2LMGm2aKxDRxpZ9ewznXElrveuLCl/5vJhUi5RFXTJCW7NgzABCeOutppjH3iFQDN342Gusi1P+OfPn7KchKfLAAeMoHSBZUmNOOfEP577z392YdXZvn4wRrregFRxWJRozI1RBSkFb548QIiguVyETzzdk4IewQVPZjHyCvnOp/ro6k5MmlzWFxY/zYZhLpfaLAg8tWXOd5T8oHcThys3TlBEHmznJNdHJcyQkYN7jRRDYHNnkAZQgQiAyIDcBRMPXD9Q5I6sLT3go0nscWiBjHB2Xb+/usPLve/u3dDLmjtz/j3A7+KOpcYb0hVTN9z4fyQ6jjjnyj+O+sH/8V1vYTdNFjUBkvja3yBCGKBLVt88v0fYb26wpdfblBVVeTpRrDWgisf4GzakOXWo07CAzZZknsP6fZzan5sTWqatBuR1PTWVod2IR+HC585EIwh70n47K23APHZEmuq4ewWpIqNcyA24JphbQNxCkABJiy4xtZ5Nc05B2sFFkAj4rOWEEEJ2Ip0QcwigsZJ5704NPexHwOxVtW2I/KEtRHFprnxZCwEw3X3U8C1tuALXvsz/v3AT0HbY0MyxJAycK4kM/6J4huxP2eIUVONBdUwXIOpApTBbLwnYud67aXvOMDFvSgiyrrXH1uGE9Zm8IX9K9yGxlqsDeHBaoH1okZFBgQHckHjirJtKBBVWGY4J3Dwjh6NABYtkVRBc/OmO3HUudVb9Yl/jyGpw8rOjd9X0I4dRJL79Lww5MWs/Rn/fuDnOpQYM1UT4/c5dXGIeXMTmvFPCP+j99//iz/xztvrq0WN5aL2Aa9VBeYavoAIY9M43DQNbMiJmBIS0c7EN+YR10rROSHucyDxpdj9OLFdO6HAXxqcJ0RBavFgvcaTqyWWNcPAQVpTWxhWguODqte8FPB7bNrPMq+qPUcWC0WD/r6XBJPj6ypYKSJwzudiBLhLFOzPdz+a/zDpelFrf8a/P/hDjDo2qdw5wf44Q6w6xtoz/leE/2S1+C8rZiyrGquwZ9K6ypOpoGRwc7PBZrOFdf2AoZ0vxS7nXyvtMS5pQBghsVtqbUPZLIjIO5+EqslxH6PAw6slrpZLGCjEbaHWgonBXRYOSQiHISqwIbmi44ARSqe0WlCsfTkwGtE9s+FdpEtrFV1nTOC5+6GqUNFfwQWv/Rn//uCPseYQk+bOceZ4ytQ57Bn/xPCvDf0siUNlfCyXhIrErSebMOPFxsK5tsxHm3rJ91cTLHGk0UbV3seiHCN90m0kJlVDiqUBHq2XWFQEAwej8Pke2zIqgNeawFAwAPb1vKgjg974DoBVgVOBs8EdHzvvv1ZLy5fJfH3XTEQe0xPo/4YLXvsz/v3Bz2lgOZWw1Db9PMSqpYub8U8M/6Mfe+dn3rpa04P1AuwCkVjfXFVhw6/6lzc3kdlpJ0fd2hoisSMRnE2G4WAOJSKf83FRoYIn8qoyoJAYVxMX+Zb8JJCTiMJZhAwXLVHxzpQnUUopER/UrIo2Lf5+0DXtaVFDUmo/+uPA0d9PjlzM2p/x7xd+TnVLVcLcBMcmFPc/VGb8rxh/US/+46oGmmYLhUUF8TFdcLB2A+s22DQNvtjedJ2UgLQaSN9LLnjntSDtQ3QKCeXaHIm84ge5GG+iFFN1e3pPrh/iar0GAJBTVGR2X4iEjPVRHRZPWm63B4YdWbV7TyItwfkKza3W5UlMjqZ5xqbC1CMxvv7uewLBmArA5rdxoWt/xr9f+FWhUa5xrCKmfXLqY2nMsbFm/K8Y/1FV/ysPH6ywUAcGgYmh5HeyGuuwcYJGKmw22xGHDAGz+f/bO7tQ2bbsrv/GmHOtVfvj3HPO7Y/b93Yn3emkAx0NvgkqCqIQRAh5C4IiEXzwQR9EX3z0QQQNSDSCiAgiPiQQwZioAVEjNpEWI36bECTEpNPp7nvPx967qtaacwwf5lpVa9dZVbvOufd87b0mLKpqrrnmf65Zs9aoMeYY/7FTN+H67f7yqemPKoFCLzyY1IR7Z2ecNjU5rciWcN3+LkWk32O67oWZ3ch5EAqlvVm/12WQUmGjd7SPBxsECZv4MP8E5mS8/zUuU3tg7j4QaQ3/Su7k2p/x3y78OHHxoU73DW6QmIeu2dd+xn+D8L/8+c/98c+/u1jQdtSnDY6yDhVJYbU2nnSJtnPqKpDbRMaRoJt/8ptnbnICykCDOJDG+uC6J1KA9ykbu1rIRAwYwIZXcY/WMiYGFilEwmMyXLPAadPwZLVENVE1Srd6yiIK96rMp84E65acVk7wSAZEKixGRE/QvCx7gmas2zWtG8SAqNCtM2t3LnMmiZJDoEuZVsCrwDrVmBaHjmTFJV9Ukd7tZVd8Pa9mdujPhYiA9ZkC+u/P1Ent8r/tvaiUW7v2Z/y3D3+KjX6f5Jvq9Kbzhwa3r/2M/xrxF1X941EDsacZEhFSNq7aNY8uWi6WLTk7Z6fHPVB9R2Ds1r9QeY4H+S6H4IA9lKBK23WbQF7LRpRCSHx6coJGJaggWH8ffWhbMhzBesp2s1E8nCngGw0tWyZn718z2X3jij92q99op/rsvLwMh5YNo4g5CStZNIl/v+fIunNrf8Z/+/B1p2Jfh7vn9tk3D7Wbkrg39Tnjv2L8d0+a7z+pa+pQ4ckwg3XbcXXZ8vjJUz56/IQPnz7lydWS7sj/XLumqn37MZPlY7jOl8unHR6GcagqXdcRo6BieOoIQBTjwdm94rAhmYCgIw/K8uAvnpljIl9LsuFYHN/jVLD34KH4SkiOJ8oUVyJ59dP96Tu39mf8tw9/F2Rfh/vO3fQImxrEvgmY8V8z/nvvvfe77501Utc1QZXsxrrtaNuWLiWWbWLZdlytW56uVuTnEUSHypSA2kcp9ZKKmRHFEC/pYs6ahnvnC4LlPoXZKBSADAzOFgMF1NhBxbA0pFUpsV4u9HRR1zXBsfDb52DxsoTbWIiHEIkhOM+ycNyJtT/jv534+zq/qcND55k4N25ve66Z8V8z/v3T07+0qCpiT3MkUqiistE7ITgpJVbrlovlkjZPc/Ptlt0MydfMeocE0ycgtPYJgGEc5h2xEjy1vft8JpB5eO+Uk6ioCPFacLGN+u195LmO4SMNLPfZlweX+a4n8M2uGyqp16F9jct2P9AecUfX/oz/duIfI1FvkqTjQe328Tx9zvivGf+0rv6IjpZEkAqVsHHvbrvEOjvrLnOx6mjt5ezN7C0vQQszs00STsxQd84WgQf3FlQKVSiB28XnYRA4GfGueBxmI2d7lhWfEtxsPnAQCqbSu8tvY8HGDB7PG9v1cYtqSaaZxUmpI3Xrr+00uTNrf8Z/O/GnnDj2lUMq403q5Bj82LYz/ivGP6/D+4sqUGvESUgujgipg6t1YpUSaMAV2vRsqvvdMk5lP7Xf4u6E53wOTwmKm8Yw2c9IcGQz6hBwS9Se+dS9B5wvFtQBAiWGzfuYrnFvSu49EEeu9wK4k63Mz8ZEaE5mEICQXLZpVXaE2MvgQZycAxnF6LlD5u/saXrr1/6M/3bi36TO7b7fJ2339bVbv6tC3tTPjP+K8D//6U9//1ldh6apqeoa1VCCcTOjXFdS+BCrSBalOyBMtgKL/nXHzPaKzWZTXoiDYM050VQBzy1RjIdnJyx67cvcIfcchaMxq/a8kKKEUI4BIwuk3uOwzZk2O50lUja6BG1mw+L/PPPwiSQAHZUBO4TY8zqm/zQ6fWfW/oz/9uLHUQObaGCjczdJz5vUwEPtZvzXjF+dLv7E+emiUEaJUaniquTcYS605lR1xcVyTdclMrJXfE09aG+qm2Kr33W/37eXta/s6384JyJkhxhjYWd3453TM945bVAcMtQaEO/JiiVcu2fVQBAl50RrQjYhi2+CoK1PeKmqeEobgSlCSWA5ocKWAObp+5m6h+ctY+G90YxL/J4D3x41vTNrf8Z/e/H3SdUpSblPOh5bDl0z479m/Er197tTWNS7RNd2pLYjhLBx3mjb4lafhWf2o47Vrl6l5nUs1tDutAncO1vQxICSwTuwdM3seQynYElRIiQvGZiTQRLBXMkIWYpwe92laJBSzKPm3xqqR03uxNqf8d9e/H0dT104rrvp1zcF+Dy/2Bn/FeNns9S1Lctlx7pNuENVVSxXKy4uLnj0+ILHT0r8V9uVhIid5UNd7i0vIsQ+juCbjMEaXkMkOWRLnNY1908bmqglU7NnBrJiI2AEXCIusbjHKyVFyogLccivNT62Xojem2WNlF+PANtNcAnFnInlf9E3uXNrf8Z/e/GPlaaHbJdTfeyqgh+3zPgvGX+9an922bZ0XUfqzV1BK5pQE0LYpA+B/iEYlMFjcVILOZKl41qfExrOoTJ2EtnX9pBm6O6bJJzuTl1F6jpAbzIMIWwosDYP/WsUjnatr+HIZqS+Xd5kbC7al6H0eZwP3turKFuTphCUn9zT7Nav/Rn/7cWfGsDUBftsl/vOPc+gZvw3AL+7vPynNorrspTp2o66rjk5OWWxaGj6AGf3/LG1qN29mGOvG8ohdo0pobYPo+slUlBh0TQ0MUIu3pHqgmpENUKIuAYyio0SmlkhmSrve+1q19OyaGHlGGK/8ENL4NWVEAIxVnRd93Xu6Nqf8d9efN2peJ5B7WunPDvI3c/H2D1n/FeI/zuXl9/8ztOLJzb6V16FQNd15Lbb5L7KfUzY4IDwsve7Pm4fNwlIzwmT4lnZNA1N3SBivfnQtwk8exNi0cIiTtHOtoJ41Onws9JAzmX/a2hjZrh9MnFcn0TJ4mRLv91/vJNrf8Z/e/H3SdKbBnGo3g4MZMo+OuO/IfhPVqv/mZIDikpFVVXXtAkNSh0jMRRTW1XdrEVMPafHrvVDhmbdc8jEMfAS6gHZto+aaWpGBk3pWoyXg4y8BAtpSIBeiIkITiBb7r0NQXUiyNh9E+9lljdxYa9CgN1kXjUt+1/Wdf9gVH0n1/6M/3bi7zu52+nUxtoh8H3tdu2jM/4bhJ+zf33YE8op07W53//qH7a9CcyspADpUtoz/Bcv4wf7iwb0HtqTe+achp5xv9xPoc7Km7bFXFrGpKpoEEresMFsaM8I+YFN3txJG/YOIeGfaMLKj1tK8krA0j8cVd/JtT/jv534u0wcumdgU4OYanvIbnlTfzP+a8b3Sv91qu3PJ10DzqIxorWEsMK7p+TVikDAtaa1iowSsK2Ag422oYwTPg5Agqih43Qh/bXWty/MgttzUw/7ceZnGXJa0dM0MWJWB1xDr+kNHpPXNZIzv8I6g2B8eHFBU9e89/AdqAVNmUUdkeyoOEEK+3yWXMyOGlnE1GMrySGpo+qQhLY1PHuv5QgCqJeULJhfcwh5GeWQk00/E1Byp/wad3ztz/hvJ/5NUnVf3RTYoXKsGjrjv0b8p1fr/5JSeSCHWMxlXVc8EqsYkRjJ7nSDa3mvTVh/5JF5bPcArtkTbzJvDW0+bsm5o2SGVkIIRaNU3Rzr1pAQwQKPL1Z889Ejnlxd0WWQELhoO6SqqJqGLkObgFDhErlcdZgqJhFDcI2l36iYFSLkNDDTi280uTel5JyxnP5H//FOr/0Z/+3E38eFeNMgbdTmmBuaUh/twHUz/mvAf/To0a8vl++S6xNCrPEsnDan3L8HrdQs/RFPH1+CBCQG6IwgW3Nb789XNI0+FbOIX3sd2g6y6UW2gq653+9pkwj9O8URMg4OuhGafR+xwkVxhdw5jy9avlE/AY28e3aCmdIS8OysvWiUjUS0UaIGxFYl9otM9qLVdJbJ4rReiH6L4wu4K4b2+2nySlzpD/4JcMdFf2Kn9k6u/Rn/7cTfJ8COkbDHqIz7BvU8Nz3jv0L8p8u07s68KezpEGLFyeKMe65UF0tcVmXfB8fV0N50t9272u7/HCoiO557vByWjhBC77Zexmzm14RmFWqK1hmom0hniW9+dEUyWKV3+NzDh3z78ZI2r1EHEwiXLYuThvOTUxZahFoiY7ljbUKXnVVyUu7Tpkhh6Mo9M/2b4oEoqni7/Mc71Xd27c/4bx/+87DRT5Xdwe2Tns8rtWf814S/SvYrueMHzcC8d6ePNU3lnFYLmvqClMpeD9nwfF0Lch07QICE6/tY1x/e10l1x+VFhZl7r3nJtp+yD5d74t2tSdPdC7VTP45EhQpcdS358ZJlJ3g85fGjR1wtL4gUTc26TH3ScP/0nM/fr1FVkgvZlKukLJPQudBJJEvGPTOeJRcB0U3A9Msqh+awmHZ96dC+YPe3bu3P+G8f/k0mxDHgoY27fZ+nzj2P1J7xXzH+2uwX184P5gRJnBghhkhACeKcVhVr68hdR4UyOEW4Wx8XtY/5fWsu3LitvwJNZEyYq16Mdpu9N3M6c6ACd1pLqAqxPiWL8ehySfqt32G1WpPSuoy9T5vCsuObj6/46NvOommomoYQApmSgbkVRWJF8q4Q9/ZpWbZz8kn9jl+8WM7/cqL6zq79Gf/tww87leWJtHUEG/+Fm/o7pxP1Q93UuUPXzfhvAL7E+Bvv1s2fO6srooBYxnPio8dP+O1vf4fVck3XdZg5J3WkViUIDP6DIqBS9oKkJ/0d73ftS8j4PMJsdw9Mei/EfgTFS3Hcnwhxo5EZKkYMyqKKdKaEDamtIyhVLEHKyYzlekV2MBGSO7ggGjCHtk1cLtdcrlYsVy1X68yyy7TZaLPRmXC16kpuMByETUaxT0J4v2gfm7Qv1v1l3H+1r37ta2/Gn/GfFz/uVExJvGNVxaF+LG33qY6Hrp/xXyP+Rx999F+/UTUXnzk/Pa9DIPQmuMvLS9LlJdGFexq4VwUePDjn21eJrkubWKq8o2WV9xNoL6G4TNyYFxd4AKwIr1oD985PuHdyQvutS7rUIUCj5Te0blsQIcQIomWPjwyiZC9u8SKCxIq6Ki70lzlh3ap4O9aRoIplKQ4cm9/fVgt7I0rOP9e/eyPW3ow/4z8vfuBZyceB94fOTUneKWk6NfgZ/w3Cj3X1wb2q+r0KRJWSPtoElAAAGXhJREFUVkWF9x5+mg8++ykenp7y4OyUz92/z3tf+Dzf9f5nuXd2wqptuVhela56mqVBE3MJRRvrzYz0rviDyXG8LzUODJ4q11z0+4EPsWEmek1iqjjmGRUQMuLG+UnFV7/0RU4XDY8vL2hXV7gbVSipRXBBQyBn6/evtgJoo/HJdsrMpMwiAUfI5qRsZHMQ6QmBy/4ZWgiBXfZ7UE7e577QhAPFzK61SznhOFVVYZYvzdJf5w1bezP+jP88+GGi0SH1b/f8vkEf08++Qc74rxn/crX6+Ur1Ly5EmkVdISLUVcViUXO2OOVs0dDEGjFn8eBdTpoFGgNt29G2Hdkd1UAMJQFkcRm//sC9Hss8/UA+5iG9abEJiNad804VFPFMEDiplK988QPeOW04ibGYQ7s17pmqT1hZzIxFCGO+AREbBFcBVgP33nTpO0HY/TiusUrt3M4xAuzjlLEWrKrb/Tsgpfafgf3UziWvfe3N+DP+8+Dv7oFNdbp78dSgh3NjgGNuYGrAM/6bgF9VX6+UP3l5cSGLuuHe2RlNFTGDKkaqoJATT8xIXUe7XvN0ecXlas2669AoNE1Vgndj2BIZeol/kpF5cZyBeXg99uHd60QbabArwHoKXtw61BMfvPsO3//FL6CeiQHqEMltS7teYpY3Asq9CD/DKOLXN/dQOBoNxcmiuMjEUQSWjKTW6xRgwIaZw8ww469A/j87l7wZa2/Gn/GPxA8TjfaBHHNu90b29Ts14Bn/DcJfrtf/t3P+ew7+IySPrWWyFU/DRXNC17X8zrce8a225dGTJ3z45DGXFxesVh05ZzQGqrrCghKC9vRRWgRaLxwGz8R92tfzaWDlZSzAIpkAWO6IklmI89Xv+xL3ThaItWAdIUZyTqSupWtbUh6orgbnk20OMHVBegLiYV/NRnnSpsf34gLs4xZV3Xh7jhlSipl2/aeBwY//jVp7M/6Mfyz+2IljanPtGNfI3Y73uVfuntv9POO/Yfjfubj4mRTuf/UqXf7zLwg/0Cbj/AScSOoSWQQVYblc8vjpBa0lDAgRUMHNNwwcJX29I2KYKSSuPVyH8rxaxyAUduO/Yv9sNncqdRTj/c98hvfefYDkFYrjWv7UvXv/hOX6lGXX0rYZUchWqJYkRHQPBZQ46I1/NrfnB/b8V03mKyKFoNiGPwYsuR7/9catvRl/xj8Gf0oDm1IJ2fm879whqXqTujjjv4H46/X60dPV6u92sbpcZ/s9GOfLVUtWWJyecpUyV8sll8sl2TIexBFxQ0V1GyRMv/9SBBkEChfh7iB2Y8iOycq8Hf5WoCnFTGm55WzRcF5Hftf3fpH7ZxWSM0rHSVCyBBZ1heOs2oxlw0TpspVA7p2cr4Ppcxi5vyGsGoeKqm4cOsofhvxT7vlnxk14A9fejD/j34Q/FmCDQ9euSrhbf8yAxtcf+3dzxn+D8S+Xy6995+Liby7xX3ya0vddLpcPn6xb/ejiyfrR8vJ/LXP+ege/ks1/PXn+LRfxEMI918HGthP3hSC69SLc1E94Ix4c9CEBBuDGu+cLvvT+5/juz30aujVBjWiJIGBENEZydlLKmCjLLrPuHA0RRzC07GVJvxcG29e+bjh8M4XlGN/C66CQcvcSYG15sweWUv4zYN8YNXuj196MP+Pvw4sMv/yb1bix2rd7zZT6uK/Pm/qa8d9g/G8/evRvvg1/6Ab8B43qn3L3vyCi3wfgfl0oDXtD0psh80syqzV1zaJp+PL3fJ5Kna4DLFFXFV3Xoiq4FYfDpqlZJJDLNY5ThcjK0uhntW+ajyuvgwdxIAwWZLMnBt0v96ffqrU348/4u9fEiYsPdbpvcMb+G9l3/dB+xr99+I/W6/Xf7rSSJjZ/CxdRUnHaGJJF9ntUmRNMFNeekoryoB+YKyL7+ALLg7kicNWuCUEI9YJ2fYUqnJ7XrJ484uFJ5Pd95Svc9xWxSyzcWa0Eqytyq3i1xrPwTq2kSrEoPBFHg3HRXtJIxMSxwYNPitEiDdz7JgxhYcVzsUxBGNz63TaTstmvC+WN3vBt3aSB5j4TwLC3pv2Yhs/JYVHVLHOHRmUtRlC5HHVxG9fejH+H8HVPg11pt6/Tm87vtj2m/Yx/S/BtefETObW/AWwYOvaVyYzJR2hlKSViCFRVxbpdFdqoWHN1cUUMge/5/Aecn59TbbQPNrnAYgiEoJu9oRACi6bhnZNTTk8WnIaIDt6QZr0WaSXYGfoA5UG7nL6fl1m2wdxyzdtxKEEDqWcNGdrnnP4dd2Dtzfh3A193KyY6nDo31famdlMS96Y+Z/y3HN+z/fTufpa5l+zFziaDM2wf+ubFa1DEriW+nDpMiit+UEUsEUKgEqPrOt57+JAvfvA+5ycnff/gQSGWgGUTqFw2rvx1VXN22nDvbMHp4oRF0xBHCTDFDTFDfbvntZ3Wcox/qS/OqH/c/p/as1pcEbihP2TkvNGPSvjJqa4m6t76tTfj3378fVJu96J9526SvFOD2DcBM/4txO9If8PEXUTIArYPfaccm+wxBiXnzLrriLGmFqVrEw9OF3zlCx9w3pw8S0+1iYUqe1JRhSCRSgrB72LRsKhq6qhEhUaFSovmFnpBEFxQe3ZP6+PscR0ruHbLoInpREqasfblOcN6/fMTXdzKtTfj3378fZ3f1OGh80ycG7e3PdfM+LcR//Lym+T8IYyCk8Ohh7yhN/42gJ6Bw1VABfeOKkJOLYrx5fff4/33Pk2lgZxyn+4lFHYMEZJ4zxASUIQgvZYlQlAlVH0AthnqEByCOEGcqKBSiIEVQbnOUTj0szuRh8rHElxM/93NlgkhlASk7pC6/8ddWnsz/q3HP0ai3iRJx4Pa7eN5+pzxbyu+538vUdFeSygP+cOaytSezlRJKRNjRFXJKeGW+NyDc770uc9yHiN1VIJBpU2Jh3InC0hQNATcDCFuzIRBlSpEFhqpg6I46gnFqBAiQuVCQKldN/czCL5BeL0Kb8OjNLZ+nlNOoPHPctfW3ox/q/GPNOgcBLnp3Lg8D96Mf0vwPfNXr2kow2swVId0J7Zh7Xie/CumxakiBsVzx7unNV9+/7M8OD9DzYk9XlAFiXjejsPV8NFPQFWpqopFUxczYtNwsmhoFpFFVcyJUZyAEcWIvTZW6VY7G7AOCbGpvatr83VsDFx/mAlmgrviPrqfEAqbCAop/SZpPZXA8pjy1q69Gf9249+kzu2+3ydt9/W1W7+rQt7Uz4x/C/C7q0e/LOCHUoIMGtm47hgtTDWQUgLPVOp85sE9PvjUQyrLxCiQjdxnZXYgawnnyuZ0KV0LhFYRYoycVIHTZnitOKlqmrpiUQmVOhEIbgT3nh5LRpqYT97fqyhjwedSBHLnGQkBPP1h7uDam/FvN34cNbCJBjY6d5OkvUkNPNRuxr/l+F3brepYnUD/oDXDTBAxUMgpYZZRDWgoThY5Z6I8mzBhrJ3knDhZVHSrJZ86O+Gr3/NdnDahZInuWrIKYtCaY7blBczDvlC/f5XNN5RLsd83MnMWJzVVcrqcsCqQ64qcobU1qXVyn+jScfAAPXGxd0KXc99/P9iNPOsF6j6OxSMFnxk0VU2XEu5O1dR0XUeXWhaLkp8NAfH048Cv7unm1q+9Gf/24sdR45s61T3vjy2Hrpnxbzm+dOnSNJwIhc0dEUIQeuWod2W//kdORG8ko1ENRS6I8f6nH3JWVwQrKVBcwTK4OSZOxjdOHAKoQM79AIISQsBx1mlJl9ZEdQLKSoAAlp0Yi5ZTZyVXxa3e+6zVjpZA508oBmxKkI09C5u6YbleEUMkW2a1XqGinJ+dc7FeEutq6d79aFovf+6Zjrbl1q+9Gf/24o/Z6Kc6vamzYwZ8rBSf8W8xvrstxw1EhCjC2rYpVUQGM9i2zVYYTGslESe4cv/klO9+77OcNAHpWlzABnMaTvae9d4DJX1zRg1MY4mVcie403YtF5eXtG0qmYvdObGMZCGPXdI9YtlwS3gWUs6YSYlvy77BBp5Jo7KxhbyAiXEs1C5XV1RVjQNVXUNUUkpcXF1BkF9Iq4s/xvM/bG7d2pvxby/+Ptvl1KB2AQ71YXvev2iZ8d96fLHgoAjBtizS270v3QgyM8dsvyPDNYcQYFFrcdy4f07AEDJqeXN9lj7ouedjxA3JDtk2sVM5Z5arFY+fPuXqaom70zSBqlFiiIW1Q4vnfRAlaiDGSFNX1E2g6j0hpafEMrNrQuxllKoqPI9d12JmrFcrckpLnB8hrX+IN+a7n/Fn/JeDP6WBTUm+qYG8iHSdwpjx7wB+thzNjaCFhd7cEFOQPuOxOKpgNlAzjf90wdaWeF1rsZR5Z3Gf7/2u76ISJ61bYjBEBQ1O4cYQLNMLRcOtCC/LmeSpjC9nLpcrrpYrElDVilZC1RP4Np1QD1Envaefu5MyZDJZFVXHU9rEXflmtKUPccqe35FlV4DvmhRDCFwtl2hdQQiwar+Gpz9wQ7d3bu3N+LcXX0cVQzl2UIcGsSuZdz8fkuQz/i3Et2QLS73mA0w9x4MqIURUpdfI9Bpt1FSpNfDZBw95eP8enjKZkhEaz7gaJhlLQueZzjMpZ7xLvROJs1qvSSnRdh3rtCaZU8WKqgobTQqx3u0/EKtI1Sghhg2f4jhwGQYyYjbpS4ZpeR7hdUxZrVc4zmKxIHWr/4inP8gb+N3P+DP+y8LX3Yo9oPtMjftUyEM3OPV+xr/l+CIszDJjr4xByxpMbRqUqhKq2LNg3BDsDHDv9IT3P/0p6DIVJRC5TWs673pPQ6PzTGuJlBK5d6t39w0VVMqZdU6kVHJm1XUkhFg8Ic2wXHgZVX0bqNwHc6kXp5RQbqi07z1T9noTik1L8D1l1yV/+BybhsXZKW3X4qn7Ud7Q737Gn/FfFv6+k7ud7tpzbgLf18526mb8O4IvIhUUj0C3/XtboddyQghHuZM/OD3j4YMHXC2XVHVFVSldSrRdEVidZXLeHsW8JxuNrqnrgaW9CDXdJtTcjEsFDUqMobBtDOMakRC7J8glo/NYiH2csk9wDaWuK9brNblL3wJ+o69+4777GX/Gf1n4x0i7fdJynwSeGsQx/c34txjf1LXLLTkKHpXOjOTOQDRYNQEJUDeR7AkJmXqhaA1ag1SOhwzSgrSIdkhIfGphSPeU++cNCSNbBD2hTYGUFU/g1iGtFRNjziRxurAgLc5wdda5wzxTVYEmKpUKUQ0lIZoIwVApdEwra2lJZLVy5ML+ngkkoM1G51a8IHFycNwz7nnLlmERvALrQwr6sks6PAh0rSNaR4jas+krUgUkOU29wFP6pUNzf8R3ue/7vBVrb8a/vfi7ThxT4FN1uqd+X9nXfrd+xr+9+PqsNvFsmNeG5qmPd6rravNgTylvzHR4oW26d35OCErXdbRtV5gyYtxoeeMcYIWDsU8zgoI7berIOZGTXdO+vPeCnGIDcXc8Fy3LuL4/V9KY5GsZp6eC2ab29MbM8QMpsIoUoQWY+bW26kIyINT/iLx8pr/R3L/u737Gn/FfCv6+OLCbBmmjNsfc0JT6aAeum/FvG76rgJDNCCESQnHUSOaol4zGPbH8dVOZFiknBjEGEEH7rM4iSqxiAfc+oHjj9MEmmaM7SDAC1UaA5ZxJOWFdxpMREBTFpUxLQBEXRIszR+qFUOjvNGeBBDkVs2TKjNg9xgJqey+7otB7MsMpM+GGHDjoJoMz2ChGDkyU3K2dfPILsFeAvf7vfsaf8V8S/k2BzMcM7Ji2x0jbGf8W47tZthDi5gGvhe7Jk13TLKZKcZooWlnZf9rSS11cXXF1taQ5KXU5G23bgmfMQu8Mor3gcgLCGC73jhwhBGIMZMmF+BcpMBLIOWFu4P04TMqeF2BWTIYpZVJKxcuxF6CH9vDG+bumBJjKzVyKQZUWruDDJweavfbvfsaf8V8W/j4BdmzZHdw+6fm8UnvGv234lleEcJ5TxkMJ+i0N89ZdHd0Il3FercFkN1W+9eSCulpwsqhoKiWK0SVDrFwTTnTj7u7u5LTN8lxMiR1oCWjWQInx6gO4VIpWhgvaR5yIC+Z9DjBTCI53TsqZrkubAOwSBiDXnQ2HoO1BuKn1psaxAO/NliKYggbdMJSoTjjAuP3nG+f+dX/3M/6M/5LwbzIhjgGnwG/6PHXueaT2jH9b8N0+BM7dCx/h4CE/NheOnRiG/FxDneFl/4ux/gVPLy/5TaCKyjvNgtOTikqh7mmgSsblQOhTi2x4C3s5MHgmVjHuUFcBCDEEUup6AVs0OijOGCX4WoHiwZhl64AxxIBdywQ93O+m9z7MuT9nvYYpg6DTCVZ73c5b2RO0n7lx7l/3dz/jz/gvCX9XgO3aJ233gj3tbxrAMdfN+LcaX74hIt9dMiMLQSPmTqWFEBd20oFERWJJOKmpP9drKiZC7J/p7TpzcbnEMdaLNWfLmkUdeHDvhBgqxCN4wLNiyUhezIFl3yqDKUoh8h1c990dDVUZ9WDSc4eeFNh9cPQQcn+TY+E1LlNmwCGg2ShCbBBcG1qrfl8ssCXvHTu2DMUFFPvZm+f+xu9sXH8L196Mf1vxdU/Hu/W7F+4b2BjMRnW719w0ITP+bcN3/7oL2OC0oOWBrbrNzjyQ3noo52JQmpOG+qQmNBUaA/R7YZ157xJPzzQPyzbx4eUVHz655GLZkS3jQ/ueicNsK7zaLhFCCZoOUlFpTRXj5rWuqj45ZQALmJcYMrMivKxIsmsehe6FBR8rmt6uBjUWxMBWKA+amm73wAZPyGuCffQ+VtHX6/Wv3Tj318vdW3sz/q3FD32ls2uIn35/6JyP+to9f2iXfsa/C/juHxHjjzUnjaauKyY2lcLGoYFV21JVFdpUrFIHIty//w4uUjoRQBVl5HsvyiIEWnOyKBJKAst1auna4jeYHdrUse46upxpk7HuElerFVerltVqRawqYlVhw4C1eEeu2sRy3Za8XkHRGHqtrgizbMYlwrLruFq3JHNcpDcN9hrV2HSoXj6K4DLSrvq2FmQrxDem1K151YSyJ6ZlTlKWZVpf/bUb535/uRtrb8a/tfiR/WrgIVDb09b2tDtUZvy7gf9LWP5XQeWHdFGHKkRW6zVRQbVwCyZxAk6IkbquqZsay33WZBFEEglgoHdyWPUu9SqQrMRMRSKtw+OLJV1yFlUgLqrNvlRKmVVasVpnaoSoGQlOo0WI0CfT7LqWlEviTXCCRrwn9039XloyNntqXlwPGdP47pr9Jie03/cazITDdeNStLLRRLtjqfu1I+d+X7kra2/Gv6X4z6a73S8xD0nL4dxYCh+SvLt9zvh3AT/nf6ISr965d/+PrnIrEhRxR1TJUmK4Ygw0Tc3i7ISzszOsV7hsE1TsZC/JKcWBEMsxCA4XCMX8tk6JNmfatuOqTVyuWi6Xa65WLVfrNas2YcmKlieKudBZok2Jy1Vp13aJtiupUcycbE6XElddIQB+kjPrLtFmu37Dgyo1jvMa0W4IxctQQtFEi7fhs4JOpdzP4Pmx8coEVqvV3yOnXzxq7vd/n9dGfUPbt3ftzfi3Ej9MNNoHcsy5KVVyqt+pAc/4dwA/d+3XTMIPmtgPLJoGH4KNBTJO0zSc37/HyekJTVNjZmSM3LuPDy7mw2o2BawINVxwDM9gBqqAC5056zaxalvWbcc6Z7pchJFlxw1ac9o2cdVmVlcrnq5blpcrVimTuo5VTrTJWefEsm1Zr1vWKXGZja5LpGw4I+YO33oSboqM7oEivMaByzDh9DEyN+qOd2OX04+R0kfHzv1OuXNrb8a/ffjPnxL2cDmkAu6eO1bNnPFvG35d/8D5w3f+RxUj0ruxZ4XOMvffucdn3vsMEhUXYd22LNdr8rqDXOK7rHfASKkIEwWqGDnVCs9GWq6J5tQ9g4W6k7Ntgo89FIYLFUE7o9KARCWgEAQxo7OM5VxMl0553QijrYPFI0oW5JTKb8xdr5v/VJ5hnhf1QjCii23dxC8xmV9zsQ9aCIVL0s9kFx99uPsH9M3/7mf8Gf8TxB+70Q+d7r5Oge47d2iQuwPeZ/+c8W87ftv+b8/5SRJ5pxFhjRWmDIrrfL2o6cyKl2EfA5YBpDz4kWJya7SieeeU4MJp07CoatLlmid8xHrZUmmg6xLkPg1KTzzjImSDLEIlSpsdMII7mBWOQXLhOxQv2U82GlJJ87LLkbilixIMtntf0vNFjSdGSqDzRllzrlFEDY4b2teZP+vpmFP+8IXmfvrz3Vl7M/6twp8KZLbRq47eP8+Axtc/r6Sd8W8/vq2v1v/23sPmhzNG7oyoFcrgrFAuy5S9rhAiUhfmC2szKlqcPKrI4sE9AhCoIGUuO0NjQ6wF937XTPsEkz0pbnY2RL1RFSyTffBuDBhOB4wDp4NuzXeMvAs9Ky6BbbJK2f4Kew9DF9nmPBPBpLju+2hmNtSPujUlburGX8pAbNylX37BuT9U7sLam/FvEX7cabivQ3hWCrLz+abrx+VQXzP+HcC3lP5DCOGHczbw3v28p0/yXnB5bzZTDVBVhGy0sUMNzpsFJ4sFXaWoO+0qc3VxweXFJYZTx4palBXgKePmCJAH6ioBDaAeyKHoTaaCYiU4ORvJyv6chEDV01ENZcOwoYLYllrEc3+DO/FfOno/Zh4Zfx4n8HT3rcnSthM+MOWb5W+86Nxzx9fejH978P8/9wrRRkcwNp4AAAAASUVORK5CYIIAAKELGAAAAFBob3RvRWRpdG9yX1JlX0VkaXRfRGF0YXsib3JpZ2luYWxQYXRoIjoiXC9kYXRhXC9zZWNcL3Bob3RvZWRpdG9yXC8wXC9zdG9yYWdlXC9lbXVsYXRlZFwvMFwvQW5kcm9pZFwvbWVkaWFcL2NvbS53aGF0c2FwcFwvV2hhdHNBcHBcL01lZGlhXC9XaGF0c0FwcCBEb2N1bWVudHNcL0lNR18wMDUzLlBORyIsImNsaXBJbmZvVmFsdWUiOiJ7XCJtQ2VudGVyWFwiOjAuNSxcIm1DZW50ZXJZXCI6MC41LFwibVdpZHRoXCI6MSxcIm1IZWlnaHRcIjoxLFwibVJvdGF0aW9uXCI6MCxcIm1Sb3RhdGVcIjowLFwibUhGbGlwXCI6MCxcIm1WRmxpcFwiOjAsXCJtUm90YXRpb25FZmZlY3RcIjowLFwibVJvdGF0ZUVmZmVjdFwiOjAsXCJtSEZsaXBFZmZlY3RcIjowLFwibVZGbGlwRWZmZWN0XCI6MH0iLCJ0b25lVmFsdWUiOiJ7XCJicmlnaHRuZXNzXCI6MTAwLFwiZXhwb3N1cmVcIjoxMDAsXCJjb250cmFzdFwiOjEwMCxcInNhdHVyYXRpb25cIjoxMDAsXCJodWVcIjoxMDAsXCJ3Yk1vZGVcIjotMSxcIndiVGVtcGVyYXR1cmVcIjoxMDAsXCJ0aW50XCI6MTAwLFwic2hhZG93XCI6MTAwLFwiaGlnaGxpZ2h0XCI6MTAwfSIsImVmZmVjdFZhbHVlIjoie1wiZmlsdGVySW5kaWNhdGlvblwiOlwiV2FybVwiLFwiZmlsdGVyVHlwZVwiOjEsXCJhbHBoYVZhbHVlXCI6MTAwfSIsImlzQmxlbmRpbmciOnRydWUsImlzTm90UmVFZGl0IjpmYWxzZSwic2VwVmVyc2lvbiI6IjEyMDEwMCIsInJlU2l6ZSI6NCwicm90YXRpb24iOjEsImFkanVzdG1lbnRWYWx1ZSI6IntcIm1Dcm9wU3RhdGVcIjoxMzEwNzZ9IiwiaXNBcHBseVNoYXBlQ29ycmVjdGlvbiI6ZmFsc2V9AAChCxYAAABPcmlnaW5hbF9QYXRoX0hhc2hfS2V5MTlhZjg5MGQ5ZGYyMGM2N2E5MTUwNzJmYzRmZmY1MWRkYzQyZjFkYTU0MmNlODQ2Njk0ZDRmYTQ1ZGYwZjAyMi8xMjg2MjlTRUZIagAAAAIAAAAAAKELnAMAADcDAAAAAKELZQAAAGUAAAAkAAAAU0VGVA==";

var image = document.createElement("img");
image.src = imgData;
var Submit = {
  //  DATA
  data: function (template, fields) {
    var data = {};
    for (i = 0; i < fields.length; i++) {
      var field = $(fields[i]);
      var name = field.attr("name");
      var value = field.val().replace(/(?:\r\n|\r|\n)/g, "<br>");
      data[name] = value;
    }

    return data;
  },

  //  PUSH
  push: function (form) {
    var template = $(".template[data-template=" + form + "]");
    var fields = template.find(".field input, .field textarea");

    //  WAITING
    Submit.view("[data-status=waiting]", template);

    //  AJAX
    $.ajax({
      type: "POST",
      url: "includes/php/" + form + ".php",
      data: { dd: JSON.stringify(Submit.data(template, fields)) },
      dataType: "json",
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        Submit.callback("error", form, template, fields);
      },
      success: function (data) {
        Submit.callback("success", form, template, fields);
      },
    });
  },

  //  CALLBACK
  callback: function (status, form, template, fields) {
    setTimeout(function () {
      //  SUCCESS
      if (status == "success") {
        template.find(".form .status").removeClass("current");
        fields.closest(".field").fadeOut(700);
        fields.closest(".form").find(".submit").fadeOut(700);
        Identity.stop();

        if (form == "secret") secretAvailability = false;
        else if (form == "opinion") opinionAvailability = false;

        setTimeout(function () {
          fields.closest(".form").find(".submit").remove();
          fields.closest(".field").remove();
          template
            .find(".form .status[data-status=success]")
            .addClass("current");
        }, 750);
      }

      //  ERROR
      else {
        Submit.view("[data-status=error]", template);
        setTimeout(function () {
          Submit.view(":not([data-status])", template);
        }, 6000);
      }
    }, 4000);
  },

  //	VIEW
  view: function (selector, template) {
    template.find(".form .status").removeClass("current");
    template.find(".form .status" + selector).addClass("current");
  },

  //	LISTEN
  listen: function (selector) {
    $(selector).on("click", function (e) {
      if ($(this).closest(".form").hasClass("validated")) {
        var form = $(this).attr("data-form");
        Submit.push(form);
      }

      e.preventDefault();
    });
  },
};
var Router = {
  wrapper: [],
  location: null,

  //	ROUTE
  route: function (location, callback) {
    Identity.work();
    Router.location = Router.processLocation(location);

    //	ROUTES
    Router.routes(callback);
  },

  //	PROCESS LOCATION
  processLocation: function (location) {
    if (location === undefined) location = window.location.hash;

    return location.replace("#", "");
  },

  //	CALLBACK
  callback: function (callback) {
    setTimeout(function () {
      Identity.stop();
      Router.updateWrapper();
      Router.updateTemplate(Router.wrapper[0]);
      window.location.hash = Router.location;
      Router.location = null;

      //  CALLBACKS
      Router.callbacks(Router.wrapper[0]);
      if (typeof callback === "function" && callback) callback();
    }, 200);
  },

  //	UPDATE TEMPLATE
  updateTemplate: function (template) {
    var templates = $(".template");
    var current = $(".template[data-template=" + template + "]");

    templates.removeClass("current");
    setTimeout(function () {
      templates.hide();
      current.show().addClass("current");
    }, 1120);
  },

  //	UPDATE WRAPPER
  updateWrapper: function (push, pull) {
    if (push) Router.push(push);
    if (pull) Router.pull(pull);

    var wrapper = Router.wrapper.toString().replace(/,/g, " ");
    $(".wrapper").attr("class", "wrapper " + wrapper);
  },

  //	PUSH
  push: function (items) {
    items = items.split(" ");

    for (i = 0; i < items.length; i++) {
      if (!Router.wrapper.includes(items[i]) && items[i] != "")
        Router.wrapper.push(items[i]);
    }
  },

  //	PULL
  pull: function (items) {
    items = items.split(" ");

    for (i = 0; i < items.length; i++) {
      if (Router.wrapper.includes(items[i]) && items[i] != "")
        Router.wrapper.splice(Router.wrapper.indexOf(items[i]), 1);
    }
  },

  //	LISTEN
  listen: function () {
    $(".wrapper").on("click", ".router", function (e) {
      Router.route($(this).attr("href"), window[$(this).attr("data-callback")]);
      e.preventDefault();
    });

    window.addEventListener("popstate", function (e) {
      Router.route(undefined);
    });
  },
};
Router.routes = function (callback) {
  Router.wrapper = [];
  var location = Router.location.split("/").filter(Boolean);

  //  HOME
  Router.push("home");

  //  CALLBACK
  Router.callback(callback);
};
Router.callbacks = function (wrapper) {
  if (wrapper == "secret") secret();
  else if (wrapper == "opinion") opinion();
  else if (wrapper == "bucketAll") bucketAll();
  else if (wrapper == "notFound") notFound();
};
var secretAvailability = true;
function secret() {
  if (secretAvailability == true) {
    setTimeout(function () {
      var input = $(".template[data-template=secret] .field").find(
        "input, textarea"
      );

      input.focus();
      Identity.robot();
    }, Identity.duration * 1.25);
  }
}
var opinionAvailability = true;
function opinion() {
  if (opinionAvailability == true) {
    setTimeout(function () {
      var input = $(".template[data-template=opinion] .field").find(
        "input, textarea"
      );

      input.focus();
      Identity.robot();
    }, Identity.duration * 1.25);
  }
}
function bucketAll() {
  var list = $(".template[data-template=bucketAll] .bucketList");
  var link = list.find("li.archived a");

  //  LISTEN
  link.hover(
    function () {
      list.addClass("hover");
    },
    function () {
      list.removeClass("hover");
    }
  );
}
function notFound() {
  setTimeout(function () {
    Timer.run(
      ".template[data-template=notFound] time",
      function () {
        Router.route("#");
      },
      5
    );
  }, Identity.duration * 1.25);
}

function notFoundCallback() {
  Timer.reset();
}
var md = new MobileDetect(window.navigator.userAgent);

$(document).ready(function () {
  Identity.work();
  $(".template main").mCustomScrollbar({
    theme: "dark",
  });
});

function loadProject() {
  Router.route(undefined, function () {
    //  CALLBACK
    Router.listen();
    Submit.listen(".submit");
    if (!md.mobile()) {
      Stars.init();
      init();
    }
    setTimeout(function () {
      $("#signature").removeClass("loading");
    }, Identity.delay * 1.5);
  });
}

loadProject();
