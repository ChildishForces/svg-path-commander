const at = {
  origin: [0, 0, 0],
  round: 4
}, q = "SVGPathCommander Error", G = {
  a: 7,
  c: 6,
  h: 1,
  l: 2,
  m: 2,
  r: 4,
  q: 4,
  s: 4,
  t: 2,
  v: 1,
  z: 0
}, wt = (e) => {
  let t = e.pathValue[e.segmentStart], n = t.toLowerCase();
  const { data: r } = e;
  for (; r.length >= G[n] && (n === "m" && r.length > 2 ? (e.segments.push([t, ...r.splice(0, 2)]), n = "l", t = t === "m" ? "l" : "L") : e.segments.push([t, ...r.splice(0, G[n])]), !!G[n]); )
    ;
}, Wt = (e) => {
  const { index: t, pathValue: n } = e, r = n.charCodeAt(t);
  if (r === 48) {
    e.param = 0, e.index += 1;
    return;
  }
  if (r === 49) {
    e.param = 1, e.index += 1;
    return;
  }
  e.err = `${q}: invalid Arc flag "${n[t]}", expecting 0 or 1 at index ${t}`;
}, z = (e) => e >= 48 && e <= 57, H = "Invalid path value", Kt = (e) => {
  const { max: t, pathValue: n, index: r } = e;
  let s = r, i = !1, o = !1, l = !1, a = !1, c;
  if (s >= t) {
    e.err = `${q}: ${H} at index ${s}, "pathValue" is missing param`;
    return;
  }
  if (c = n.charCodeAt(s), (c === 43 || c === 45) && (s += 1, c = n.charCodeAt(s)), !z(c) && c !== 46) {
    e.err = `${q}: ${H} at index ${s}, "${n[s]}" is not a number`;
    return;
  }
  if (c !== 46) {
    if (i = c === 48, s += 1, c = n.charCodeAt(s), i && s < t && c && z(c)) {
      e.err = `${q}: ${H} at index ${r}, "${n[r]}" illegal number`;
      return;
    }
    for (; s < t && z(n.charCodeAt(s)); )
      s += 1, o = !0;
    c = n.charCodeAt(s);
  }
  if (c === 46) {
    for (a = !0, s += 1; z(n.charCodeAt(s)); )
      s += 1, l = !0;
    c = n.charCodeAt(s);
  }
  if (c === 101 || c === 69) {
    if (a && !o && !l) {
      e.err = `${q}: ${H} at index ${s}, "${n[s]}" invalid float exponent`;
      return;
    }
    if (s += 1, c = n.charCodeAt(s), (c === 43 || c === 45) && (s += 1), s < t && z(n.charCodeAt(s)))
      for (; s < t && z(n.charCodeAt(s)); )
        s += 1;
    else {
      e.err = `${q}: ${H} at index ${s}, "${n[s]}" invalid integer exponent`;
      return;
    }
  }
  e.index = s, e.param = +e.pathValue.slice(r, s);
}, _t = (e) => [
  // Special spaces
  5760,
  6158,
  8192,
  8193,
  8194,
  8195,
  8196,
  8197,
  8198,
  8199,
  8200,
  8201,
  8202,
  8239,
  8287,
  12288,
  65279,
  // Line terminators
  10,
  13,
  8232,
  8233,
  // White spaces
  32,
  9,
  11,
  12,
  160
].includes(e), B = (e) => {
  const { pathValue: t, max: n } = e;
  for (; e.index < n && _t(t.charCodeAt(e.index)); )
    e.index += 1;
}, te = (e) => {
  switch (e | 32) {
    case 109:
    case 122:
    case 108:
    case 104:
    case 118:
    case 99:
    case 115:
    case 113:
    case 116:
    case 97:
      return !0;
    default:
      return !1;
  }
}, ee = (e) => z(e) || e === 43 || e === 45 || e === 46, ne = (e) => (e | 32) === 97, It = (e) => {
  const { max: t, pathValue: n, index: r } = e, s = n.charCodeAt(r), i = G[n[r].toLowerCase()];
  if (e.segmentStart = r, !te(s)) {
    e.err = `${q}: ${H} "${n[r]}" is not a path command`;
    return;
  }
  if (e.index += 1, B(e), e.data = [], !i) {
    wt(e);
    return;
  }
  for (; ; ) {
    for (let o = i; o > 0; o -= 1) {
      if (ne(s) && (o === 3 || o === 4) ? Wt(e) : Kt(e), e.err.length)
        return;
      e.data.push(e.param), B(e), e.index < t && n.charCodeAt(e.index) === 44 && (e.index += 1, B(e));
    }
    if (e.index >= e.max || !ee(n.charCodeAt(e.index)))
      break;
  }
  wt(e);
};
class Ot {
  constructor(t) {
    this.segments = [], this.pathValue = t, this.max = t.length, this.index = 0, this.param = 0, this.segmentStart = 0, this.data = [], this.err = "";
  }
}
const ct = (e) => Array.isArray(e) && e.every((t) => {
  const n = t[0].toLowerCase();
  return G[n] === t.length - 1 && "achlmqstvz".includes(n);
}), Z = (e) => {
  if (ct(e))
    return [...e];
  const t = new Ot(e);
  for (B(t); t.index < t.max && !t.err.length; )
    It(t);
  if (t.err && t.err.length)
    throw TypeError(t.err);
  return t.segments;
}, se = (e) => {
  const t = e.length;
  let n = -1, r, s = e[t - 1], i = 0;
  for (; ++n < t; )
    r = s, s = e[n], i += r[1] * s[0] - r[0] * s[1];
  return i / 2;
}, U = (e, t) => Math.sqrt((e[0] - t[0]) * (e[0] - t[0]) + (e[1] - t[1]) * (e[1] - t[1])), re = (e) => e.reduce((t, n, r) => r ? t + U(e[r - 1], n) : 0, 0);
var ie = Object.defineProperty, oe = (e, t, n) => t in e ? ie(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, C = (e, t, n) => (oe(e, typeof t != "symbol" ? t + "" : t, n), n);
const ae = {
  a: 1,
  b: 0,
  c: 0,
  d: 1,
  e: 0,
  f: 0,
  m11: 1,
  m12: 0,
  m13: 0,
  m14: 0,
  m21: 0,
  m22: 1,
  m23: 0,
  m24: 0,
  m31: 0,
  m32: 0,
  m33: 1,
  m34: 0,
  m41: 0,
  m42: 0,
  m43: 0,
  m44: 1,
  is2D: !0,
  isIdentity: !0
}, zt = (e) => (e instanceof Float64Array || e instanceof Float32Array || Array.isArray(e) && e.every((t) => typeof t == "number")) && [6, 16].some((t) => e.length === t), jt = (e) => e instanceof DOMMatrix || e instanceof P || typeof e == "object" && Object.keys(ae).every((t) => e && t in e), W = (e) => {
  const t = new P(), n = Array.from(e);
  if (!zt(n))
    throw TypeError(`CSSMatrix: "${n.join(",")}" must be an array with 6/16 numbers.`);
  if (n.length === 16) {
    const [r, s, i, o, l, a, c, m, u, f, x, h, y, g, p, d] = n;
    t.m11 = r, t.a = r, t.m21 = l, t.c = l, t.m31 = u, t.m41 = y, t.e = y, t.m12 = s, t.b = s, t.m22 = a, t.d = a, t.m32 = f, t.m42 = g, t.f = g, t.m13 = i, t.m23 = c, t.m33 = x, t.m43 = p, t.m14 = o, t.m24 = m, t.m34 = h, t.m44 = d;
  } else if (n.length === 6) {
    const [r, s, i, o, l, a] = n;
    t.m11 = r, t.a = r, t.m12 = s, t.b = s, t.m21 = i, t.c = i, t.m22 = o, t.d = o, t.m41 = l, t.e = l, t.m42 = a, t.f = a;
  }
  return t;
}, Et = (e) => {
  if (jt(e))
    return W([
      e.m11,
      e.m12,
      e.m13,
      e.m14,
      e.m21,
      e.m22,
      e.m23,
      e.m24,
      e.m31,
      e.m32,
      e.m33,
      e.m34,
      e.m41,
      e.m42,
      e.m43,
      e.m44
    ]);
  throw TypeError(`CSSMatrix: "${JSON.stringify(e)}" is not a DOMMatrix / CSSMatrix / JSON compatible object.`);
}, Dt = (e) => {
  if (typeof e != "string")
    throw TypeError(`CSSMatrix: "${JSON.stringify(e)}" is not a string.`);
  const t = String(e).replace(/\s/g, "");
  let n = new P();
  const r = `CSSMatrix: invalid transform string "${e}"`;
  return t.split(")").filter((s) => s).forEach((s) => {
    const [i, o] = s.split("(");
    if (!o)
      throw TypeError(r);
    const l = o.split(",").map((h) => h.includes("rad") ? parseFloat(h) * (180 / Math.PI) : parseFloat(h)), [a, c, m, u] = l, f = [a, c, m], x = [a, c, m, u];
    if (i === "perspective" && a && [c, m].every((h) => h === void 0))
      n.m34 = -1 / a;
    else if (i.includes("matrix") && [6, 16].includes(l.length) && l.every((h) => !Number.isNaN(+h))) {
      const h = l.map((y) => Math.abs(y) < 1e-6 ? 0 : y);
      n = n.multiply(W(h));
    } else if (i === "translate3d" && f.every((h) => !Number.isNaN(+h)))
      n = n.translate(a, c, m);
    else if (i === "translate" && a && m === void 0)
      n = n.translate(a, c || 0, 0);
    else if (i === "rotate3d" && x.every((h) => !Number.isNaN(+h)) && u)
      n = n.rotateAxisAngle(a, c, m, u);
    else if (i === "rotate" && a && [c, m].every((h) => h === void 0))
      n = n.rotate(0, 0, a);
    else if (i === "scale3d" && f.every((h) => !Number.isNaN(+h)) && f.some((h) => h !== 1))
      n = n.scale(a, c, m);
    else if (i === "scale" && !Number.isNaN(a) && a !== 1 && m === void 0) {
      const h = Number.isNaN(+c) ? a : c;
      n = n.scale(a, h, 1);
    } else if (i === "skew" && (a || !Number.isNaN(a) && c) && m === void 0)
      n = n.skew(a, c || 0);
    else if (["translate", "rotate", "scale", "skew"].some((h) => i.includes(h)) && /[XYZ]/.test(i) && a && [c, m].every((h) => h === void 0))
      if (i === "skewX" || i === "skewY")
        n = n[i](a);
      else {
        const h = i.replace(/[XYZ]/, ""), y = i.replace(h, ""), g = ["X", "Y", "Z"].indexOf(y), p = h === "scale" ? 1 : 0, d = [g === 0 ? a : p, g === 1 ? a : p, g === 2 ? a : p];
        n = n[h](...d);
      }
    else
      throw TypeError(r);
  }), n;
}, gt = (e, t) => t ? [e.a, e.b, e.c, e.d, e.e, e.f] : [
  e.m11,
  e.m12,
  e.m13,
  e.m14,
  e.m21,
  e.m22,
  e.m23,
  e.m24,
  e.m31,
  e.m32,
  e.m33,
  e.m34,
  e.m41,
  e.m42,
  e.m43,
  e.m44
], Ht = (e, t, n) => {
  const r = new P();
  return r.m41 = e, r.e = e, r.m42 = t, r.f = t, r.m43 = n, r;
}, Rt = (e, t, n) => {
  const r = new P(), s = Math.PI / 180, i = e * s, o = t * s, l = n * s, a = Math.cos(i), c = -Math.sin(i), m = Math.cos(o), u = -Math.sin(o), f = Math.cos(l), x = -Math.sin(l), h = m * f, y = -m * x;
  r.m11 = h, r.a = h, r.m12 = y, r.b = y, r.m13 = u;
  const g = c * u * f + a * x;
  r.m21 = g, r.c = g;
  const p = a * f - c * u * x;
  return r.m22 = p, r.d = p, r.m23 = -c * m, r.m31 = c * x - a * u * f, r.m32 = c * f + a * u * x, r.m33 = a * m, r;
}, Zt = (e, t, n, r) => {
  const s = new P(), i = Math.sqrt(e * e + t * t + n * n);
  if (i === 0)
    return s;
  const o = e / i, l = t / i, a = n / i, c = r * (Math.PI / 360), m = Math.sin(c), u = Math.cos(c), f = m * m, x = o * o, h = l * l, y = a * a, g = 1 - 2 * (h + y) * f;
  s.m11 = g, s.a = g;
  const p = 2 * (o * l * f + a * m * u);
  s.m12 = p, s.b = p, s.m13 = 2 * (o * a * f - l * m * u);
  const d = 2 * (l * o * f - a * m * u);
  s.m21 = d, s.c = d;
  const A = 1 - 2 * (y + x) * f;
  return s.m22 = A, s.d = A, s.m23 = 2 * (l * a * f + o * m * u), s.m31 = 2 * (a * o * f + l * m * u), s.m32 = 2 * (a * l * f - o * m * u), s.m33 = 1 - 2 * (x + h) * f, s;
}, Xt = (e, t, n) => {
  const r = new P();
  return r.m11 = e, r.a = e, r.m22 = t, r.d = t, r.m33 = n, r;
}, lt = (e, t) => {
  const n = new P();
  if (e) {
    const r = e * Math.PI / 180, s = Math.tan(r);
    n.m21 = s, n.c = s;
  }
  if (t) {
    const r = t * Math.PI / 180, s = Math.tan(r);
    n.m12 = s, n.b = s;
  }
  return n;
}, Ft = (e) => lt(e, 0), Yt = (e) => lt(0, e), k = (e, t) => {
  const n = t.m11 * e.m11 + t.m12 * e.m21 + t.m13 * e.m31 + t.m14 * e.m41, r = t.m11 * e.m12 + t.m12 * e.m22 + t.m13 * e.m32 + t.m14 * e.m42, s = t.m11 * e.m13 + t.m12 * e.m23 + t.m13 * e.m33 + t.m14 * e.m43, i = t.m11 * e.m14 + t.m12 * e.m24 + t.m13 * e.m34 + t.m14 * e.m44, o = t.m21 * e.m11 + t.m22 * e.m21 + t.m23 * e.m31 + t.m24 * e.m41, l = t.m21 * e.m12 + t.m22 * e.m22 + t.m23 * e.m32 + t.m24 * e.m42, a = t.m21 * e.m13 + t.m22 * e.m23 + t.m23 * e.m33 + t.m24 * e.m43, c = t.m21 * e.m14 + t.m22 * e.m24 + t.m23 * e.m34 + t.m24 * e.m44, m = t.m31 * e.m11 + t.m32 * e.m21 + t.m33 * e.m31 + t.m34 * e.m41, u = t.m31 * e.m12 + t.m32 * e.m22 + t.m33 * e.m32 + t.m34 * e.m42, f = t.m31 * e.m13 + t.m32 * e.m23 + t.m33 * e.m33 + t.m34 * e.m43, x = t.m31 * e.m14 + t.m32 * e.m24 + t.m33 * e.m34 + t.m34 * e.m44, h = t.m41 * e.m11 + t.m42 * e.m21 + t.m43 * e.m31 + t.m44 * e.m41, y = t.m41 * e.m12 + t.m42 * e.m22 + t.m43 * e.m32 + t.m44 * e.m42, g = t.m41 * e.m13 + t.m42 * e.m23 + t.m43 * e.m33 + t.m44 * e.m43, p = t.m41 * e.m14 + t.m42 * e.m24 + t.m43 * e.m34 + t.m44 * e.m44;
  return W([n, r, s, i, o, l, a, c, m, u, f, x, h, y, g, p]);
};
class P {
  constructor(t) {
    return this.a = 1, this.b = 0, this.c = 0, this.d = 1, this.e = 0, this.f = 0, this.m11 = 1, this.m12 = 0, this.m13 = 0, this.m14 = 0, this.m21 = 0, this.m22 = 1, this.m23 = 0, this.m24 = 0, this.m31 = 0, this.m32 = 0, this.m33 = 1, this.m34 = 0, this.m41 = 0, this.m42 = 0, this.m43 = 0, this.m44 = 1, t ? this.setMatrixValue(t) : this;
  }
  get isIdentity() {
    return this.m11 === 1 && this.m12 === 0 && this.m13 === 0 && this.m14 === 0 && this.m21 === 0 && this.m22 === 1 && this.m23 === 0 && this.m24 === 0 && this.m31 === 0 && this.m32 === 0 && this.m33 === 1 && this.m34 === 0 && this.m41 === 0 && this.m42 === 0 && this.m43 === 0 && this.m44 === 1;
  }
  get is2D() {
    return this.m31 === 0 && this.m32 === 0 && this.m33 === 1 && this.m34 === 0 && this.m43 === 0 && this.m44 === 1;
  }
  setMatrixValue(t) {
    return typeof t == "string" && t.length && t !== "none" ? Dt(t) : Array.isArray(t) || t instanceof Float64Array || t instanceof Float32Array ? W(t) : typeof t == "object" ? Et(t) : this;
  }
  toFloat32Array(t) {
    return Float32Array.from(gt(this, t));
  }
  toFloat64Array(t) {
    return Float64Array.from(gt(this, t));
  }
  toString() {
    const { is2D: t } = this, n = this.toFloat64Array(t).join(", ");
    return `${t ? "matrix" : "matrix3d"}(${n})`;
  }
  toJSON() {
    const { is2D: t, isIdentity: n } = this;
    return { ...this, is2D: t, isIdentity: n };
  }
  multiply(t) {
    return k(this, t);
  }
  translate(t, n, r) {
    const s = t;
    let i = n, o = r;
    return typeof i > "u" && (i = 0), typeof o > "u" && (o = 0), k(this, Ht(s, i, o));
  }
  scale(t, n, r) {
    const s = t;
    let i = n, o = r;
    return typeof i > "u" && (i = t), typeof o > "u" && (o = 1), k(this, Xt(s, i, o));
  }
  rotate(t, n, r) {
    let s = t, i = n || 0, o = r || 0;
    return typeof t == "number" && typeof n > "u" && typeof r > "u" && (o = s, s = 0, i = 0), k(this, Rt(s, i, o));
  }
  rotateAxisAngle(t, n, r, s) {
    if ([t, n, r, s].some((i) => Number.isNaN(+i)))
      throw new TypeError("CSSMatrix: expecting 4 values");
    return k(this, Zt(t, n, r, s));
  }
  skewX(t) {
    return k(this, Ft(t));
  }
  skewY(t) {
    return k(this, Yt(t));
  }
  skew(t, n) {
    return k(this, lt(t, n));
  }
  transformPoint(t) {
    const n = this.m11 * t.x + this.m21 * t.y + this.m31 * t.z + this.m41 * t.w, r = this.m12 * t.x + this.m22 * t.y + this.m32 * t.z + this.m42 * t.w, s = this.m13 * t.x + this.m23 * t.y + this.m33 * t.z + this.m43 * t.w, i = this.m14 * t.x + this.m24 * t.y + this.m34 * t.z + this.m44 * t.w;
    return t instanceof DOMPoint ? new DOMPoint(n, r, s, i) : {
      x: n,
      y: r,
      z: s,
      w: i
    };
  }
}
C(P, "Translate", Ht), C(P, "Rotate", Rt), C(P, "RotateAxisAngle", Zt), C(P, "Scale", Xt), C(P, "SkewX", Ft), C(P, "SkewY", Yt), C(P, "Skew", lt), C(P, "Multiply", k), C(P, "fromArray", W), C(P, "fromMatrix", Et), C(P, "fromString", Dt), C(P, "toArray", gt), C(P, "isCompatibleArray", zt), C(P, "isCompatibleObject", jt);
const At = (e) => ct(e) && // `isPathArray` also checks if it's `Array`
e.every(([t]) => t === t.toUpperCase()), E = (e) => {
  if (At(e))
    return [...e];
  const t = Z(e);
  let n = 0, r = 0, s = 0, i = 0;
  return t.map((o) => {
    const l = o.slice(1).map(Number), [a] = o, c = a.toUpperCase();
    if (a === "M")
      return [n, r] = l, s = n, i = r, ["M", n, r];
    let m = [];
    if (a !== c)
      if (c === "A")
        m = [
          c,
          l[0],
          l[1],
          l[2],
          l[3],
          l[4],
          l[5] + n,
          l[6] + r
        ];
      else if (c === "V")
        m = [c, l[0] + r];
      else if (c === "H")
        m = [c, l[0] + n];
      else {
        const u = l.map((f, x) => f + (x % 2 ? r : n));
        m = [c, ...u];
      }
    else
      m = [c, ...l];
    return c === "Z" ? (n = s, r = i) : c === "H" ? [, n] = m : c === "V" ? [, r] = m : ([n, r] = m.slice(-2), c === "M" && (s = n, i = r)), m;
  });
}, ce = (e, t) => {
  const [n] = e, { x1: r, y1: s, x2: i, y2: o } = t, l = e.slice(1).map(Number);
  let a = e;
  if ("TQ".includes(n) || (t.qx = null, t.qy = null), n === "H")
    a = ["L", e[1], s];
  else if (n === "V")
    a = ["L", r, e[1]];
  else if (n === "S") {
    const c = r * 2 - i, m = s * 2 - o;
    t.x1 = c, t.y1 = m, a = ["C", c, m, ...l];
  } else if (n === "T") {
    const c = r * 2 - (t.qx ? t.qx : (
      /* istanbul ignore next */
      0
    )), m = s * 2 - (t.qy ? t.qy : (
      /* istanbul ignore next */
      0
    ));
    t.qx = c, t.qy = m, a = ["Q", c, m, ...l];
  } else if (n === "Q") {
    const [c, m] = l;
    t.qx = c, t.qy = m;
  }
  return a;
}, Pt = (e) => At(e) && e.every(([t]) => "ACLMQZ".includes(t)), mt = {
  x1: 0,
  y1: 0,
  x2: 0,
  y2: 0,
  x: 0,
  y: 0,
  qx: null,
  qy: null
}, I = (e) => {
  if (Pt(e))
    return [...e];
  const t = E(e), n = { ...mt }, r = t.length;
  for (let s = 0; s < r; s += 1) {
    t[s], t[s] = ce(t[s], n);
    const i = t[s], o = i.length;
    n.x1 = +i[o - 2], n.y1 = +i[o - 1], n.x2 = +i[o - 4] || n.x1, n.y2 = +i[o - 3] || n.y1;
  }
  return t;
}, V = (e, t, n) => {
  const [r, s] = e, [i, o] = t;
  return [r + (i - r) * n, s + (o - s) * n];
}, pt = (e, t, n, r, s) => {
  const i = U([e, t], [n, r]);
  let o = { x: 0, y: 0 };
  if (typeof s == "number")
    if (s <= 0)
      o = { x: e, y: t };
    else if (s >= i)
      o = { x: n, y: r };
    else {
      const [l, a] = V([e, t], [n, r], s / i);
      o = { x: l, y: a };
    }
  return {
    length: i,
    point: o,
    min: {
      x: Math.min(e, n),
      y: Math.min(t, r)
    },
    max: {
      x: Math.max(e, n),
      y: Math.max(t, r)
    }
  };
}, vt = (e, t) => {
  const { x: n, y: r } = e, { x: s, y: i } = t, o = n * s + r * i, l = Math.sqrt((n ** 2 + r ** 2) * (s ** 2 + i ** 2));
  return (n * i - r * s < 0 ? -1 : 1) * Math.acos(o / l);
}, le = (e, t, n, r, s, i, o, l, a, c) => {
  const { abs: m, sin: u, cos: f, sqrt: x, PI: h } = Math;
  let y = m(n), g = m(r);
  const d = (s % 360 + 360) % 360 * (h / 180);
  if (e === l && t === a)
    return { x: e, y: t };
  if (y === 0 || g === 0)
    return pt(e, t, l, a, c).point;
  const A = (e - l) / 2, b = (t - a) / 2, M = {
    x: f(d) * A + u(d) * b,
    y: -u(d) * A + f(d) * b
  }, w = M.x ** 2 / y ** 2 + M.y ** 2 / g ** 2;
  w > 1 && (y *= x(w), g *= x(w));
  const $ = y ** 2 * g ** 2 - y ** 2 * M.y ** 2 - g ** 2 * M.x ** 2, X = y ** 2 * M.y ** 2 + g ** 2 * M.x ** 2;
  let D = $ / X;
  D = D < 0 ? 0 : D;
  const K = (i !== o ? 1 : -1) * x(D), S = {
    x: K * (y * M.y / g),
    y: K * (-(g * M.x) / y)
  }, _ = {
    x: f(d) * S.x - u(d) * S.y + (e + l) / 2,
    y: u(d) * S.x + f(d) * S.y + (t + a) / 2
  }, F = {
    x: (M.x - S.x) / y,
    y: (M.y - S.y) / g
  }, tt = vt({ x: 1, y: 0 }, F), et = {
    x: (-M.x - S.x) / y,
    y: (-M.y - S.y) / g
  };
  let T = vt(F, et);
  !o && T > 0 ? T -= 2 * h : o && T < 0 && (T += 2 * h), T %= 2 * h;
  const L = tt + T * c, Y = y * f(L), Q = g * u(L);
  return {
    x: f(d) * Y - u(d) * Q + _.x,
    y: u(d) * Y + f(d) * Q + _.y
  };
}, me = (e, t, n, r, s, i, o, l, a, c) => {
  const m = typeof c == "number";
  let u = e, f = t, x = 0, h = [u, f, x], y = [u, f], g = 0, p = { x: 0, y: 0 }, d = [{ x: u, y: f }];
  m && c <= 0 && (p = { x: u, y: f });
  const A = 300;
  for (let b = 0; b <= A; b += 1) {
    if (g = b / A, { x: u, y: f } = le(e, t, n, r, s, i, o, l, a, g), d = [...d, { x: u, y: f }], x += U(y, [u, f]), y = [u, f], m && x > c && c > h[2]) {
      const M = (x - c) / (x - h[2]);
      p = {
        x: y[0] * (1 - M) + h[0] * M,
        y: y[1] * (1 - M) + h[1] * M
      };
    }
    h = [u, f, x];
  }
  return m && c >= x && (p = { x: l, y: a }), {
    length: x,
    point: p,
    min: {
      x: Math.min(...d.map((b) => b.x)),
      y: Math.min(...d.map((b) => b.y))
    },
    max: {
      x: Math.max(...d.map((b) => b.x)),
      y: Math.max(...d.map((b) => b.y))
    }
  };
}, he = (e, t, n, r, s, i, o, l, a) => {
  const c = 1 - a;
  return {
    x: c ** 3 * e + 3 * c ** 2 * a * n + 3 * c * a ** 2 * s + a ** 3 * o,
    y: c ** 3 * t + 3 * c ** 2 * a * r + 3 * c * a ** 2 * i + a ** 3 * l
  };
}, ue = (e, t, n, r, s, i, o, l, a) => {
  const c = typeof a == "number";
  let m = e, u = t, f = 0, x = [m, u, f], h = [m, u], y = 0, g = { x: 0, y: 0 }, p = [{ x: m, y: u }];
  c && a <= 0 && (g = { x: m, y: u });
  const d = 300;
  for (let A = 0; A <= d; A += 1) {
    if (y = A / d, { x: m, y: u } = he(e, t, n, r, s, i, o, l, y), p = [...p, { x: m, y: u }], f += U(h, [m, u]), h = [m, u], c && f > a && a > x[2]) {
      const b = (f - a) / (f - x[2]);
      g = {
        x: h[0] * (1 - b) + x[0] * b,
        y: h[1] * (1 - b) + x[1] * b
      };
    }
    x = [m, u, f];
  }
  return c && a >= f && (g = { x: o, y: l }), {
    length: f,
    point: g,
    min: {
      x: Math.min(...p.map((A) => A.x)),
      y: Math.min(...p.map((A) => A.y))
    },
    max: {
      x: Math.max(...p.map((A) => A.x)),
      y: Math.max(...p.map((A) => A.y))
    }
  };
}, ye = (e, t, n, r, s, i, o) => {
  const l = 1 - o;
  return {
    x: l ** 2 * e + 2 * l * o * n + o ** 2 * s,
    y: l ** 2 * t + 2 * l * o * r + o ** 2 * i
  };
}, fe = (e, t, n, r, s, i, o) => {
  const l = typeof o == "number";
  let a = e, c = t, m = 0, u = [a, c, m], f = [a, c], x = 0, h = { x: 0, y: 0 }, y = [{ x: a, y: c }];
  l && o <= 0 && (h = { x: a, y: c });
  const g = 300;
  for (let p = 0; p <= g; p += 1) {
    if (x = p / g, { x: a, y: c } = ye(e, t, n, r, s, i, x), y = [...y, { x: a, y: c }], m += U(f, [a, c]), f = [a, c], l && m > o && o > u[2]) {
      const d = (m - o) / (m - u[2]);
      h = {
        x: f[0] * (1 - d) + u[0] * d,
        y: f[1] * (1 - d) + u[1] * d
      };
    }
    u = [a, c, m];
  }
  return l && o >= m && (h = { x: s, y: i }), {
    length: m,
    point: h,
    min: {
      x: Math.min(...y.map((p) => p.x)),
      y: Math.min(...y.map((p) => p.y))
    },
    max: {
      x: Math.max(...y.map((p) => p.x)),
      y: Math.max(...y.map((p) => p.y))
    }
  };
}, ht = (e, t) => {
  const n = I(e), r = typeof t == "number";
  let s, i = [], o, l = 0, a = 0, c = 0, m = 0, u, f = [], x = [], h = 0, y = { x: 0, y: 0 }, g = y, p = y, d = y, A = 0;
  for (let b = 0, M = n.length; b < M; b += 1)
    u = n[b], [o] = u, s = o === "M", i = s ? i : [l, a, ...u.slice(1)], s ? ([, c, m] = u, y = { x: c, y: m }, g = y, h = 0, r && t < 1e-3 && (d = y)) : o === "L" ? { length: h, min: y, max: g, point: p } = pt(
      ...i,
      (t || 0) - A
    ) : o === "A" ? { length: h, min: y, max: g, point: p } = me(
      ...i,
      (t || 0) - A
    ) : o === "C" ? { length: h, min: y, max: g, point: p } = ue(
      ...i,
      (t || 0) - A
    ) : o === "Q" ? { length: h, min: y, max: g, point: p } = fe(
      ...i,
      (t || 0) - A
    ) : o === "Z" && (i = [l, a, c, m], { length: h, min: y, max: g, point: p } = pt(
      ...i,
      (t || 0) - A
    )), r && A < t && A + h >= t && (d = p), x = [...x, g], f = [...f, y], A += h, [l, a] = o !== "Z" ? u.slice(-2) : [c, m];
  return r && t >= A && (d = { x: l, y: a }), {
    length: A,
    point: d,
    min: {
      x: Math.min(...f.map((b) => b.x)),
      y: Math.min(...f.map((b) => b.y))
    },
    max: {
      x: Math.max(...x.map((b) => b.x)),
      y: Math.max(...x.map((b) => b.y))
    }
  };
}, dt = (e) => {
  if (!e)
    return {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      x2: 0,
      y2: 0,
      cx: 0,
      cy: 0,
      cz: 0
    };
  const {
    min: { x: t, y: n },
    max: { x: r, y: s }
  } = ht(e), i = r - t, o = s - n;
  return {
    width: i,
    height: o,
    x: t,
    y: n,
    x2: r,
    y2: s,
    cx: t + i / 2,
    cy: n + o / 2,
    // an estimate
    cz: Math.max(i, o) + Math.min(i, o) / 2
  };
}, bt = (e, t, n) => {
  if (e[n].length > 7) {
    e[n].shift();
    const r = e[n];
    let s = n;
    for (; r.length; )
      t[n] = "A", e.splice(s += 1, 0, ["C", ...r.splice(0, 6)]);
    e.splice(n, 1);
  }
}, Qt = (e) => Pt(e) && e.every(([t]) => "MC".includes(t)), nt = (e, t, n) => {
  const r = e * Math.cos(n) - t * Math.sin(n), s = e * Math.sin(n) + t * Math.cos(n);
  return { x: r, y: s };
}, Gt = (e, t, n, r, s, i, o, l, a, c) => {
  let m = e, u = t, f = n, x = r, h = l, y = a;
  const g = Math.PI * 120 / 180, p = Math.PI / 180 * (+s || 0);
  let d = [], A, b, M, w, $;
  if (c)
    [b, M, w, $] = c;
  else {
    A = nt(m, u, -p), m = A.x, u = A.y, A = nt(h, y, -p), h = A.x, y = A.y;
    const N = (m - h) / 2, v = (u - y) / 2;
    let O = N * N / (f * f) + v * v / (x * x);
    O > 1 && (O = Math.sqrt(O), f *= O, x *= O);
    const ft = f * f, xt = x * x, Ct = (i === o ? -1 : 1) * Math.sqrt(Math.abs((ft * xt - ft * v * v - xt * N * N) / (ft * v * v + xt * N * N)));
    w = Ct * f * v / x + (m + h) / 2, $ = Ct * -x * N / f + (u + y) / 2, b = Math.asin(((u - $) / x * 10 ** 9 >> 0) / 10 ** 9), M = Math.asin(((y - $) / x * 10 ** 9 >> 0) / 10 ** 9), b = m < w ? Math.PI - b : b, M = h < w ? Math.PI - M : M, b < 0 && (b = Math.PI * 2 + b), M < 0 && (M = Math.PI * 2 + M), o && b > M && (b -= Math.PI * 2), !o && M > b && (M -= Math.PI * 2);
  }
  let X = M - b;
  if (Math.abs(X) > g) {
    const N = M, v = h, O = y;
    M = b + g * (o && M > b ? 1 : -1), h = w + f * Math.cos(M), y = $ + x * Math.sin(M), d = Gt(h, y, f, x, s, 0, o, v, O, [M, N, w, $]);
  }
  X = M - b;
  const D = Math.cos(b), K = Math.sin(b), S = Math.cos(M), _ = Math.sin(M), F = Math.tan(X / 4), tt = 4 / 3 * f * F, et = 4 / 3 * x * F, T = [m, u], L = [m + tt * K, u - et * D], Y = [h + tt * _, y - et * S], Q = [h, y];
  if (L[0] = 2 * T[0] - L[0], L[1] = 2 * T[1] - L[1], c)
    return [...L, ...Y, ...Q, ...d];
  d = [...L, ...Y, ...Q, ...d];
  const yt = [];
  for (let N = 0, v = d.length; N < v; N += 1)
    yt[N] = N % 2 ? nt(d[N - 1], d[N], p).y : nt(d[N], d[N + 1], p).x;
  return yt;
}, xe = (e, t, n, r, s, i) => {
  const o = 0.3333333333333333, l = 2 / 3;
  return [
    o * e + l * n,
    // cpx1
    o * t + l * r,
    // cpy1
    o * s + l * n,
    // cpx2
    o * i + l * r,
    // cpy2
    s,
    i
    // x,y
  ];
}, St = (e, t, n, r) => [...V([e, t], [n, r], 0.5), n, r, n, r], rt = (e, t) => {
  const [n] = e, r = e.slice(1).map(Number), [s, i] = r;
  let o;
  const { x1: l, y1: a, x: c, y: m } = t;
  return "TQ".includes(n) || (t.qx = null, t.qy = null), n === "M" ? (t.x = s, t.y = i, e) : n === "A" ? (o = [l, a, ...r], ["C", ...Gt(...o)]) : n === "Q" ? (t.qx = s, t.qy = i, o = [l, a, ...r], ["C", ...xe(...o)]) : n === "L" ? ["C", ...St(l, a, s, i)] : n === "Z" ? ["C", ...St(l, a, c, m)] : e;
}, it = (e) => {
  if (Qt(e))
    return [...e];
  const t = I(e), n = { ...mt }, r = [];
  let s = "", i = t.length;
  for (let o = 0; o < i; o += 1) {
    [s] = t[o], r[o] = s, t[o] = rt(t[o], n), bt(t, r, o), i = t.length;
    const l = t[o], a = l.length;
    n.x1 = +l[a - 2], n.y1 = +l[a - 1], n.x2 = +l[a - 4] || n.x1, n.y2 = +l[a - 3] || n.y1;
  }
  return t;
}, ge = (e, t, n, r, s, i, o, l) => 3 * ((l - t) * (n + s) - (o - e) * (r + i) + r * (e - s) - n * (t - i) + l * (s + e / 3) - o * (i + t / 3)) / 20, Bt = (e) => {
  let t = 0, n = 0, r = 0;
  return it(e).map((s) => {
    switch (s[0]) {
      case "M":
        return [, t, n] = s, 0;
      default:
        return r = ge(t, n, ...s.slice(1)), [t, n] = s.slice(-2), r;
    }
  }).reduce((s, i) => s + i, 0);
}, R = (e) => ht(e).length, pe = (e) => Bt(it(e)) >= 0, J = (e, t) => ht(e, t).point, Nt = (e, t) => {
  const n = Z(e);
  let r = [...n], s = R(r), i = r.length - 1, o = 0, l = 0, a = n[0];
  const [c, m] = a.slice(-2), u = { x: c, y: m };
  if (i <= 0 || !t || !Number.isFinite(t))
    return {
      segment: a,
      index: 0,
      length: l,
      point: u,
      lengthAtSegment: o
    };
  if (t >= s)
    return r = n.slice(0, -1), o = R(r), l = s - o, {
      segment: n[i],
      index: i,
      length: l,
      lengthAtSegment: o
    };
  const f = [];
  for (; i > 0; )
    a = r[i], r = r.slice(0, -1), o = R(r), l = s - o, s = o, f.push({
      segment: a,
      index: i,
      length: l,
      lengthAtSegment: o
    }), i -= 1;
  return f.find(({ lengthAtSegment: x }) => x <= t);
}, ut = (e, t) => {
  const n = Z(e), r = I(n), s = R(n), i = (b) => {
    const M = b.x - t.x, w = b.y - t.y;
    return M * M + w * w;
  };
  let o = 8, l, a = { x: 0, y: 0 }, c = 0, m = 0, u = 1 / 0;
  for (let b = 0; b <= s; b += o)
    l = J(r, b), c = i(l), c < u && (a = l, m = b, u = c);
  o /= 2;
  let f, x, h = 0, y = 0, g = 0, p = 0;
  for (; o > 0.5; )
    h = m - o, f = J(r, h), g = i(f), y = m + o, x = J(r, y), p = i(x), h >= 0 && g < u ? (a = f, m = h, u = g) : y <= s && p < u ? (a = x, m = y, u = p) : o /= 2;
  const d = Nt(n, m), A = Math.sqrt(u);
  return { closest: a, distance: A, segment: d };
}, de = (e, t) => ut(e, t).closest, be = (e, t) => ut(e, t).segment, Me = (e, t) => Nt(e, t).segment, Ae = (e, t) => {
  const { distance: n } = ut(e, t);
  return Math.abs(n) < 1e-3;
}, Jt = (e) => {
  if (typeof e != "string")
    return !1;
  const t = new Ot(e);
  for (B(t); t.index < t.max && !t.err.length; )
    It(t);
  return !t.err.length && "mM".includes(t.segments[0][0]);
}, Ut = (e) => ct(e) && // `isPathArray` checks if it's `Array`
e.slice(1).every(([t]) => t === t.toLowerCase()), ot = (e, t) => {
  let { round: n } = at;
  if (t === "off" || n === "off")
    return [...e];
  n = typeof t == "number" && t >= 0 ? t : n;
  const r = typeof n == "number" && n >= 1 ? 10 ** n : 1;
  return e.map((s) => {
    const i = s.slice(1).map(Number).map((o) => n ? Math.round(o * r) / r : Math.round(o));
    return [s[0], ...i];
  });
}, j = (e, t) => ot(e, t).map((n) => n[0] + n.slice(1).join(" ")).join(""), Tt = {
  line: ["x1", "y1", "x2", "y2"],
  circle: ["cx", "cy", "r"],
  ellipse: ["cx", "cy", "rx", "ry"],
  rect: ["width", "height", "x", "y", "rx", "ry"],
  polygon: ["points"],
  polyline: ["points"],
  glyph: ["d"]
}, Pe = (e) => {
  const { x1: t, y1: n, x2: r, y2: s } = e;
  return [
    ["M", t, n],
    ["L", r, s]
  ];
}, Ne = (e) => {
  const t = [], n = (e.points || "").trim().split(/[\s|,]/).map(Number);
  let r = 0;
  for (; r < n.length; )
    t.push([r ? "L" : "M", n[r], n[r + 1]]), r += 2;
  return e.type === "polygon" ? [...t, ["z"]] : t;
}, Ce = (e) => {
  const { cx: t, cy: n, r } = e;
  return [
    ["M", t - r, n],
    ["a", r, r, 0, 1, 0, 2 * r, 0],
    ["a", r, r, 0, 1, 0, -2 * r, 0]
  ];
}, we = (e) => {
  const { cx: t, cy: n, rx: r, ry: s } = e;
  return [
    ["M", t - r, n],
    ["a", r, s, 0, 1, 0, 2 * r, 0],
    ["a", r, s, 0, 1, 0, -2 * r, 0]
  ];
}, ve = (e) => {
  const t = +e.x || 0, n = +e.y || 0, r = +e.width, s = +e.height;
  let i = +e.rx, o = +e.ry;
  return i || o ? (i = i || o, o = o || i, i * 2 > r && (i -= (i * 2 - r) / 2), o * 2 > s && (o -= (o * 2 - s) / 2), [
    ["M", t + i, n],
    ["h", r - i * 2],
    ["s", i, 0, i, o],
    ["v", s - o * 2],
    ["s", 0, o, -i, o],
    ["h", -r + i * 2],
    ["s", -i, 0, -i, -o],
    ["v", -s + o * 2],
    ["s", 0, -o, i, -o]
  ]) : [["M", t, n], ["h", r], ["v", s], ["H", t], ["Z"]];
}, Se = (e, t, n) => {
  const r = n || document, s = r.defaultView || /* istanbul ignore next */
  window, i = Object.keys(Tt), o = e instanceof s.SVGElement, l = o ? e.tagName : null;
  if (l && i.every((h) => l !== h))
    throw TypeError(`${q}: "${l}" is not SVGElement`);
  const a = r.createElementNS("http://www.w3.org/2000/svg", "path"), c = o ? l : e.type, m = Tt[c], u = { type: c };
  o ? (m.forEach((h) => {
    m.includes(h) && (u[h] = e.getAttribute(h));
  }), Object.values(e.attributes).forEach(({ name: h, value: y }) => {
    m.includes(h) || a.setAttribute(h, y);
  })) : (Object.assign(u, e), Object.keys(u).forEach((h) => {
    !m.includes(h) && h !== "type" && a.setAttribute(
      h.replace(/[A-Z]/g, (y) => `-${y.toLowerCase()}`),
      u[h]
    );
  }));
  let f = "";
  const x = at.round;
  return c === "circle" ? f = j(Ce(u), x) : c === "ellipse" ? f = j(we(u), x) : ["polyline", "polygon"].includes(c) ? f = j(Ne(u), x) : c === "rect" ? f = j(ve(u), x) : c === "line" ? f = j(Pe(u), x) : c === "glyph" && (f = o ? e.getAttribute("d") : e.d), Jt(f) ? (a.setAttribute("d", f), t && o && (e.before(a, e), e.remove()), a) : !1;
}, Lt = (e) => {
  const t = [];
  let n, r = -1;
  return e.forEach((s) => {
    s[0] === "M" ? (n = [s], r += 1) : n = [...n, s], t[r] = n;
  }), t;
}, Mt = (e) => {
  if (Ut(e))
    return [...e];
  const t = Z(e);
  let n = 0, r = 0, s = 0, i = 0;
  return t.map((o) => {
    const l = o.slice(1).map(Number), [a] = o, c = a.toLowerCase();
    if (a === "M")
      return [n, r] = l, s = n, i = r, ["M", n, r];
    let m = [];
    if (a !== c)
      if (c === "a")
        m = [
          c,
          l[0],
          l[1],
          l[2],
          l[3],
          l[4],
          l[5] - n,
          l[6] - r
        ];
      else if (c === "v")
        m = [c, l[0] - r];
      else if (c === "h")
        m = [c, l[0] - n];
      else {
        const f = l.map((x, h) => x - (h % 2 ? r : n));
        m = [c, ...f];
      }
    else
      a === "m" && (s = l[0] + n, i = l[1] + r), m = [c, ...l];
    const u = m.length;
    return c === "z" ? (n = s, r = i) : c === "h" ? n += m[1] : c === "v" ? r += m[1] : (n += m[u - 2], r += m[u - 1]), m;
  });
}, Te = (e, t, n, r) => {
  const [s] = e, i = (p) => Math.round(p * 10 ** 4) / 10 ** 4, o = e.slice(1).map((p) => +p), l = t.slice(1).map((p) => +p), { x1: a, y1: c, x2: m, y2: u, x: f, y: x } = n;
  let h = e;
  const [y, g] = l.slice(-2);
  if ("TQ".includes(s) || (n.qx = null, n.qy = null), ["V", "H", "S", "T", "Z"].includes(s))
    h = [s, ...o];
  else if (s === "L")
    i(f) === i(y) ? h = ["V", g] : i(x) === i(g) && (h = ["H", y]);
  else if (s === "C") {
    const [p, d] = l;
    "CS".includes(r) && (i(p) === i(a * 2 - m) && i(d) === i(c * 2 - u) || i(a) === i(m * 2 - f) && i(c) === i(u * 2 - x)) && (h = ["S", ...l.slice(-4)]), n.x1 = p, n.y1 = d;
  } else if (s === "Q") {
    const [p, d] = l;
    n.qx = p, n.qy = d, "QT".includes(r) && (i(p) === i(a * 2 - m) && i(d) === i(c * 2 - u) || i(a) === i(m * 2 - f) && i(c) === i(u * 2 - x)) && (h = ["T", ...l.slice(-2)]);
  }
  return h;
}, kt = (e, t) => {
  const n = E(e), r = I(n), s = { ...mt }, i = [], o = n.length;
  let l = "", a = "", c = 0, m = 0, u = 0, f = 0;
  for (let y = 0; y < o; y += 1) {
    [l] = n[y], i[y] = l, y && (a = i[y - 1]), n[y] = Te(n[y], r[y], s, a);
    const g = n[y], p = g.length;
    switch (s.x1 = +g[p - 2], s.y1 = +g[p - 1], s.x2 = +g[p - 4] || s.x1, s.y2 = +g[p - 3] || s.y1, l) {
      case "Z":
        c = u, m = f;
        break;
      case "H":
        [, c] = g;
        break;
      case "V":
        [, m] = g;
        break;
      default:
        [c, m] = g.slice(-2).map(Number), l === "M" && (u = c, f = m);
    }
    s.x = c, s.y = m;
  }
  const x = ot(n, t), h = ot(Mt(n), t);
  return x.map((y, g) => g ? y.join("").length < h[g].join("").length ? y : h[g] : y);
}, Le = (e) => {
  const t = e.slice(1).map(
    (n, r, s) => r ? [...s[r - 1].slice(-2), ...n.slice(1)] : [...e[0].slice(1), ...n.slice(1)]
  ).map((n) => n.map((r, s) => n[n.length - s - 2 * (1 - s % 2)])).reverse();
  return [["M", ...t[0].slice(0, 2)], ...t.map((n) => ["C", ...n.slice(2)])];
}, st = (e) => {
  const t = E(e), n = t.slice(-1)[0][0] === "Z", r = I(t).map((s, i) => {
    const [o, l] = s.slice(-2).map(Number);
    return {
      seg: t[i],
      // absolute
      n: s,
      // normalized
      c: t[i][0],
      // pathCommand
      x: o,
      // x
      y: l
      // y
    };
  }).map((s, i, o) => {
    const l = s.seg, a = s.n, c = i && o[i - 1], m = o[i + 1], u = s.c, f = o.length, x = i ? o[i - 1].x : o[f - 1].x, h = i ? o[i - 1].y : o[f - 1].y;
    let y = [];
    switch (u) {
      case "M":
        y = n ? ["Z"] : [u, x, h];
        break;
      case "A":
        y = [u, ...l.slice(1, -3), l[5] === 1 ? 0 : 1, x, h];
        break;
      case "C":
        m && m.c === "S" ? y = ["S", l[1], l[2], x, h] : y = [u, l[3], l[4], l[1], l[2], x, h];
        break;
      case "S":
        c && "CS".includes(c.c) && (!m || m.c !== "S") ? y = ["C", a[3], a[4], a[1], a[2], x, h] : y = [u, a[1], a[2], x, h];
        break;
      case "Q":
        m && m.c === "T" ? y = ["T", x, h] : y = [u, ...l.slice(1, -2), x, h];
        break;
      case "T":
        c && "QT".includes(c.c) && (!m || m.c !== "T") ? y = ["Q", a[1], a[2], x, h] : y = [u, x, h];
        break;
      case "Z":
        y = ["M", x, h];
        break;
      case "H":
        y = [u, x];
        break;
      case "V":
        y = [u, h];
        break;
      default:
        y = [u, ...l.slice(1, -2), x, h];
    }
    return y;
  });
  return n ? r.reverse() : [r[0], ...r.slice(1).reverse()];
}, ke = (e) => {
  let t = new P();
  const { origin: n } = e, [r, s] = n, { translate: i } = e, { rotate: o } = e, { skew: l } = e, { scale: a } = e;
  return Array.isArray(i) && i.length >= 2 && i.every((c) => !Number.isNaN(+c)) && i.some((c) => c !== 0) ? t = t.translate(...i) : typeof i == "number" && !Number.isNaN(i) && (t = t.translate(i)), (o || l || a) && (t = t.translate(r, s), Array.isArray(o) && o.length >= 2 && o.every((c) => !Number.isNaN(+c)) && o.some((c) => c !== 0) ? t = t.rotate(...o) : typeof o == "number" && !Number.isNaN(o) && (t = t.rotate(o)), Array.isArray(l) && l.length === 2 && l.every((c) => !Number.isNaN(+c)) && l.some((c) => c !== 0) ? (t = l[0] ? t.skewX(l[0]) : t, t = l[1] ? t.skewY(l[1]) : t) : typeof l == "number" && !Number.isNaN(l) && (t = t.skewX(l)), Array.isArray(a) && a.length >= 2 && a.every((c) => !Number.isNaN(+c)) && a.some((c) => c !== 1) ? t = t.scale(...a) : typeof a == "number" && !Number.isNaN(a) && (t = t.scale(a)), t = t.translate(-r, -s)), t;
}, qe = (e, t) => {
  let n = P.Translate(...t.slice(0, -1));
  return [, , , n.m44] = t, n = e.multiply(n), [n.m41, n.m42, n.m43, n.m44];
}, qt = (e, t, n) => {
  const [r, s, i] = n, [o, l, a] = qe(e, [...t, 0, 1]), c = o - r, m = l - s, u = a - i;
  return [
    // protect against division by ZERO
    c * (Math.abs(i) / Math.abs(u) || 1) + r,
    m * (Math.abs(i) / Math.abs(u) || 1) + s
  ];
}, $t = (e, t) => {
  let n = 0, r = 0, s, i, o, l, a, c;
  const m = E(e), u = t && Object.keys(t);
  if (!t || u && !u.length)
    return [...m];
  const f = I(m);
  if (!t.origin) {
    const { origin: M } = at;
    Object.assign(t, { origin: M });
  }
  const x = ke(t), { origin: h } = t, y = { ...mt };
  let g = [], p = 0, d = "", A = [];
  const b = [];
  if (!x.isIdentity) {
    for (s = 0, o = m.length; s < o; s += 1) {
      g = m[s], m[s] && ([d] = g), b[s] = d, d === "A" && (g = rt(f[s], y), m[s] = rt(f[s], y), bt(m, b, s), f[s] = rt(f[s], y), bt(f, b, s), o = Math.max(m.length, f.length)), g = f[s], p = g.length, y.x1 = +g[p - 2], y.y1 = +g[p - 1], y.x2 = +g[p - 4] || y.x1, y.y2 = +g[p - 3] || y.y1;
      const M = {
        s: m[s],
        c: m[s][0],
        x: y.x1,
        y: y.y1
      };
      A = [...A, M];
    }
    return A.map((M) => {
      if (d = M.c, g = M.s, d === "L" || d === "H" || d === "V")
        return [a, c] = qt(x, [M.x, M.y], h), n !== a && r !== c ? g = ["L", a, c] : r === c ? g = ["H", a] : n === a && (g = ["V", c]), n = a, r = c, g;
      for (i = 1, l = g.length; i < l; i += 2)
        [n, r] = qt(x, [+g[i], +g[i + 1]], h), g[i] = n, g[i + 1] = r;
      return g;
    });
  }
  return [...m];
}, $e = (e) => {
  const n = e.slice(0, 2), r = e.slice(2, 4), s = e.slice(4, 6), i = e.slice(6, 8), o = V(n, r, 0.5), l = V(r, s, 0.5), a = V(s, i, 0.5), c = V(o, l, 0.5), m = V(l, a, 0.5), u = V(c, m, 0.5);
  return [
    ["C", ...o, ...c, ...u],
    ["C", ...m, ...a, ...i]
  ];
}, Vt = (e, t) => {
  const [n, r] = e, [s, i] = t, o = (i - s) / (r - n);
  return (l) => s + o * (l - n);
}, Ve = (e, t, n) => {
  const r = E(e), s = Vt([t.x, t.x2], [n.x, n.x2]), i = Vt([t.y, t.y2], [n.y, n.y2]);
  return r.map((o) => {
    const [l] = o;
    switch (l) {
      case "A": {
        const [, a, c, m, u, f, x, h] = o;
        return ["A", s(a), i(c), m, u, f, s(x), i(h)];
      }
      case "H": {
        const [, a] = o;
        return ["H", s(a)];
      }
      case "V": {
        const [, a] = o;
        return ["V", i(a)];
      }
      default:
        return [
          l,
          ...o.slice(1).map((a, c) => c % 2 ? i(a) : s(a))
        ];
    }
  });
}, Ie = (e, t) => {
  const { x: n, y: r, x2: s, y2: i } = dt(e), o = { x: (n + s) / 2, y: (r + i) / 2 }, l = t.x2 - t.x, a = t.y2 - t.y, c = { x: l / 2, y: a / 2 }, m = { x: c.x - o.x + t.x, y: c.y - o.y + t.y };
  return e.map((u) => {
    const [f] = u;
    switch (f) {
      case "A": {
        const [, x, h, y, g, p, d, A] = u;
        return ["A", x + m.x, h + m.y, y, g, p, d + m.x, A + m.y];
      }
      case "H": {
        const [, x] = u;
        return ["H", x + m.x];
      }
      case "V": {
        const [, x] = u;
        return ["V", x + m.y];
      }
      default:
        return [
          f,
          ...u.slice(1).map((x, h) => h % 2 ? x + m.y : x + m.x)
        ];
    }
  });
}, Oe = (e, t, n, r, s) => {
  const i = e * s, o = (t.x + t.x2) / 2, l = o - i / 2, a = o + i / 2;
  return { x: l, y: n, x2: a, y2: r };
}, ze = (e, t, n, r, s) => {
  const i = s / e, o = (t.y + t.y2) / 2, l = o - i / 2, a = o + i / 2;
  return { x: n, y: l, x2: r, y2: a };
}, je = (e, t, n) => {
  const r = e.x2 - e.x, s = e.y2 - e.y, i = r / s, o = n - t;
  return (s > r ? Oe : ze)(i, e, t, n, o);
};
class Ee {
  // bring main utilities to front
  static CSSMatrix = P;
  static getPathBBox = dt;
  static getPathArea = Bt;
  static getTotalLength = R;
  static getDrawDirection = pe;
  static getPointAtLength = J;
  static pathLengthFactory = ht;
  static getPropertiesAtLength = Nt;
  static getPropertiesAtPoint = ut;
  static polygonLength = re;
  static polygonArea = se;
  static getClosestPoint = de;
  static getSegmentOfPoint = be;
  static getSegmentAtLength = Me;
  static isPointInStroke = Ae;
  static isValidPath = Jt;
  static isPathArray = ct;
  static isAbsoluteArray = At;
  static isRelativeArray = Ut;
  static isCurveArray = Qt;
  static isNormalizedArray = Pt;
  static shapeToPath = Se;
  static parsePathString = Z;
  static roundPath = ot;
  static splitPath = Lt;
  static splitCubic = $e;
  static optimizePath = kt;
  static reverseCurve = Le;
  static reversePath = st;
  static normalizePath = I;
  static transformPath = $t;
  static pathToAbsolute = E;
  static pathToRelative = Mt;
  static pathToCurve = it;
  static pathToString = j;
  /**
   * @constructor
   * @param {string} pathValue the path string
   * @param {any} config instance options
   */
  constructor(t, n) {
    const r = n || {}, s = typeof t > "u";
    if (s || !t.length)
      throw TypeError(`${q}: "pathValue" is ${s ? "undefined" : "empty"}`);
    const i = Z(t);
    this.segments = i;
    const { width: o, height: l, cx: a, cy: c, cz: m } = this.getBBox(), { round: u, origin: f } = r;
    let x;
    if (u === "auto") {
      const y = `${Math.floor(Math.max(o, l))}`.length;
      x = y >= 4 ? 0 : 4 - y;
    } else
      Number.isInteger(u) || u === "off" ? x = u : x = at.round;
    let h;
    if (Array.isArray(f) && f.length >= 2) {
      const [y, g, p] = f.map(Number);
      h = [
        Number.isNaN(y) ? a : y,
        Number.isNaN(g) ? c : g,
        Number.isNaN(p) ? m : p
      ];
    } else
      h = [a, c, m];
    return this.round = x, this.origin = h, this;
  }
  /**
   * Returns the path bounding box, equivalent to native `path.getBBox()`.
   *
   * @public
   * @returns the pathBBox
   */
  getBBox() {
    return dt(this.segments);
  }
  /**
   * Returns the total path length, equivalent to native `path.getTotalLength()`.
   *
   * @public
   * @returns the path total length
   */
  getTotalLength() {
    return R(this.segments);
  }
  /**
   * Returns an `{x,y}` point in the path stroke at a given length,
   * equivalent to the native `path.getPointAtLength()`.
   *
   * @public
   * @param length the length
   * @returns the requested point
   */
  getPointAtLength(t) {
    return J(this.segments, t);
  }
  /**
   * Convert path to absolute values
   *
   * @public
   */
  toAbsolute() {
    const { segments: t } = this;
    return this.segments = E(t), this;
  }
  /**
   * Convert path to relative values
   *
   * @public
   */
  toRelative() {
    const { segments: t } = this;
    return this.segments = Mt(t), this;
  }
  /**
   * Convert path to cubic-bezier values. In addition, un-necessary `Z`
   * segment is removed if previous segment extends to the `M` segment.
   *
   * @public
   */
  toCurve() {
    const { segments: t } = this;
    return this.segments = it(t), this;
  }
  /**
   * Reverse the order of the segments and their values.
   *
   * @param onlySubpath option to reverse all sub-paths except first
   * @public
   */
  reverse(t) {
    this.toAbsolute();
    const { segments: n } = this, r = Lt(n), s = r.length > 1 ? r : !1, i = s ? [...s].map((l, a) => t ? a ? st(l) : [...l] : st(l)) : [...n];
    let o = [];
    return s ? o = i.flat(1) : o = t ? n : st(n), this.segments = [...o], this;
  }
  /**
   * Normalize path in 2 steps:
   * * convert `pathArray`(s) to absolute values
   * * convert shorthand notation to standard notation
   *
   * @public
   */
  normalize() {
    const { segments: t } = this;
    return this.segments = I(t), this;
  }
  /**
   * Optimize `pathArray` values:
   * * convert segments to absolute and/or relative values
   * * select segments with shortest resulted string
   * * round values to the specified `decimals` option value
   *
   * @public
   */
  optimize() {
    const { segments: t } = this;
    return this.segments = kt(t, this.round), this;
  }
  /**
   * Transform path using values from an `Object` defined as `transformObject`.
   *
   * @see TransformObject for a quick refference
   *
   * @param source a `transformObject`as described above
   * @public
   */
  transform(t) {
    if (!t || typeof t != "object" || typeof t == "object" && !["translate", "rotate", "skew", "scale"].some((a) => a in t))
      return this;
    const {
      segments: n,
      origin: [r, s, i]
    } = this, o = {};
    for (const [a, c] of Object.entries(t))
      a === "skew" && Array.isArray(c) || (a === "rotate" || a === "translate" || a === "origin" || a === "scale") && Array.isArray(c) ? o[a] = c.map(Number) : a !== "origin" && typeof Number(c) == "number" && (o[a] = Number(c));
    const { origin: l } = o;
    if (Array.isArray(l) && l.length >= 2) {
      const [a, c, m] = l.map(Number);
      o.origin = [Number.isNaN(a) ? r : a, Number.isNaN(c) ? s : c, m || i];
    } else
      o.origin = [r, s, i];
    return this.segments = $t(n, o), this;
  }
  /**
   * Rotate path 180deg vertically
   *
   * @public
   */
  flipX() {
    return this.transform({ rotate: [0, 180, 0] }), this;
  }
  /**
   * Rotate path 180deg horizontally
   *
   * @public
   */
  flipY() {
    return this.transform({ rotate: [180, 0, 0] }), this;
  }
  /**
   * Interpolate to a new bounding box
   *
   * @param boundingBox
   * @public
   */
  interpolate(t) {
    const n = this.getBBox();
    return this.segments = Ve(this.segments, n, t), this;
  }
  /**
   * Interpolate to a new bounding box
   *
   * @param boundingBox
   * @public
   */
  centerIn(t) {
    return this.segments = Ie(this.segments, t), this;
  }
  /**
   * Uniformly scale a bounding box so that the largest dimension
   * now starts and ends with the provided min and max
   *
   * @param min
   * @param max
   * @public
   */
  getUniformlyScaledBBox(t, n) {
    return je(this.getBBox(), t, n);
  }
  /**
   * Uniformly scale a path so that the largest dimension
   * now starts and ends with the provided min and max
   *
   * @param min
   * @param max
   */
  uniformlyScale(t, n) {
    const r = this.getUniformlyScaledBBox(t, n);
    return this.interpolate(r), this;
  }
  /**
   * Export the current path to be used
   * for the `d` (description) attribute.
   *
   * @public
   * @return the path string
   */
  toString() {
    return j(this.segments, this.round);
  }
}
export {
  Ee as default
};
//# sourceMappingURL=svg-path-commander.mjs.map
