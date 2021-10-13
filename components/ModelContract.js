export function ModelContract(params){
    return `
package ${params.params.package}.models;

import java.io.Serializable;

public class ModelContract implements Serializable {

}
`
}