/*
* (c) Copyright IBM Corporation 2021
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

/*
 * Converts from lowercase slash separated to camel case java class names
 */
export function toJavaClassName(name) {
  const components = name.split((/[^A-Za-z0-9]/));
  return components.map(item => item.charAt(0).toUpperCase() + item.slice(1)).join('');
}

export function javaPackageToPath(pkg) {
  return `/${  pkg.split('.').join('/')  }/`;
}
