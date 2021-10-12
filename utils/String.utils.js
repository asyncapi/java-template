
/* 
 * Converts from lowercase slash seperated to camel case java class names
 */
export function toJavaClassName(name){
    let components = name.split('/')
  
    return components.map(item => item.charAt(0).toUpperCase() + item.slice(1)).join('');
  }

export function javaPackageToPath(pkg) {
  return "/" + pkg.split('.').join('/') + "/";
}