# jsoncodegen

> JSON code generator CLI.

Takes a folder of JSON type declarations, and generates POJOs / TypeScript interfaces / Kotlin data classes. You can also write your own generator.

**Input (MyObject.json):**

```JSON
{
  "name": "string",
  "flag": "boolean",
  "count": "number",
  "arrayOfStrings": "string[]",
  "mapStringToNumber": "number{}",
  "myOtherObject": "./MyOtherObject"
}
```

**Output (MyObject.ts):**

```TS
import { MyOtherObject as __type___MyOtherObject } from "./MyOtherObject"

export interface MyObject {
  readonly name: string
  readonly flag: boolean
  readonly count: number
  readonly arrayOfStrings: readonly string[]
  readonly mapStringToNumber: { readonly [key: string]: number }
  readonly myOtherObject: __type___MyOtherObject
}
```

**Output (MyObject.kt):**

```kt
package com.example

data class JsonInterfaceMixedTest(
  val name: String,
  val flag: Boolean,
  val count: Double,
  val arrayOfStrings: List<String>,
  val mapStringToNumber: Map<String, Double>,
  val myOtherObject: com.example.MyOtherObject
) {
}
```

**Output (MyObject.java):**

```java
package com.example;

// ... imports

public final class MyObject {
  private final String name;
  private final Boolean flag;
  private final Double count;
  private final java.util.List<String> arrayOfStrings;
  private final java.util.Map<String, Double> mapStringToNumber;
  private final com.example.MyOtherObject myOtherObject;
  
  public JsonInterfaceMixedTest(Builder<...> builder) {
    Validate.notNull(builder.name, "Argument 'name' must not be null.");
    // ...
    this.name = builder.name;
  }
  // ... hashCode, equals, toString, Builder, etc.
}
```

## Install

### Install the CLI

```
npm i -D jsoncodegen
```

### Install one or more generators

**TypeScript:**

```
npm i -D jsoncodegen-generator-typescript
```

**Kotlin:**

```
npm i -D jsoncodegen-generator-kotlin-jackson
```

**Java Jackson:**

```
npm i -D jsoncodegen-generator-java-jackson
```

## Use

**Warning: The output directory will be deleted. Back up your project.**

```
./node_modules/.bin/jsoncodegen --generator typescript --inputDir src --outputDir build
```

Please note that the `--generator` option accepts only the end (`"FOO"`) of `"jsoncodegen-generator-FOO"`.

## Syntax

### Interface

Put each interface in its own file. The file name will be the name of the interface. Start the name with a capital letter to match the TS / Java / Kotlin convention.

You can nest interfaces in folders. Folder names must not be reserved keywords in the target language. Prefer all lowercase names for folders, as they will become packages in Java / Kotlin.

When naming folders / files / properties, avoid using special characters, spaces and hyphens. Also, names starting and ending with double underscores (ex. `__RESERVED__`) are reserved for generator use.

An interface is expressed as an object in a JSON file:

```JSON
{
  ".is": "interface"
}
```

`".is": "interface"` is optional. An object means an interface by default.

The interface can have a description. This will become a comment in the output.

```JSON
{
  ".description": "A person."
}
```

You can declare properties like this:

```JSON
{
  "name": "string"
}
```

**Property names starting and ending with double underscores (ex. `"__RESERVED__"`) are reserved.**

**Property names starting with a period (ex. `".is": "interface"`) are metadata and will not become properties.**

#### Property types

##### String: `"string"`

##### Boolean: `"boolean"`

##### Number: `"number"`

##### Array: `"string[]"` or `"boolean[]"` or `"number[]"`, etc.

##### Map: `"string{}"` or `"boolean{}"` or `"number{}"`, etc.

##### Interface: `"com/example/MyOtherObject"` or `"./MyOtherObject"`

##### Enum: `"com/example/MyEnum"` or `"./MyEnum"`

##### Enum value: `"com/example/City.Budapest"` or `"./City.Budapest"`

#### Null

Types are not nullable by default.

Types can be made nullable by adding a question mark (`?`) after them. Example:

```JSON
{
  "requiredFlag": "boolean",
  "optionalFlag": "boolean?"
}
```

In this example, `"requiredFlag"` must always be provided.

On the other hand, `"optionalFlag"` is optional. It can be `boolean` or it can be `null`, or it can be omitted entirely.

It is also possible to make an array (or map) required, but its values nullable. Like this:

```JSON
{
  "arrayOfNumbersAndNulls": "number?[]"
}
```

Or the opposite:

```JSON
{
  "optionalArrayOfNumbers": "number[]?"
}
```

Or both:

```JSON
{
  "optionalArrayOfNumbersAndNulls": "number?[]?"
}
```

*A note on `undefined`: JavaScript will return `undefined` when a nullable value is omitted. However, there is no `undefined` in JSON. It also does not exist in Java or Kotlin. Therefore this tool does not differentiate between `null` and `undefined`.*

#### Property description

You can add a description for a single property like this:

```JSON
{
  "name": ["string", "The full name of this person."]
}
```

#### Mixins

Mixins can be used to define common properties. To define a mixin, put it in a JSON file:

**PersonMixin.json**

```JSON
{
  ".is": "mixin",
  ".description": "Common person properties.",
  
  "id": "string",
  "source": "string"
}
```

Then reference it in the target interface:

**Person.json**

```JSON
{
  ".is": "interface",
  ".description": "A person.",
  "...": ["./PersonMixin"],
  
  "name": "string"
}
```

The properties of the mixin will be merged with the properties of the interface. Multiple mixins may be provided in the `"..."` array.

### Enums

Enums come in two flavors: string enums and number enums.

```JSON
{
  ".is": "enum",
  ".description": "This is a number enum.",

  "Zero": 0,
  "One": [1, "The number one."],
  "Pi": 3.14
}
```

```JSON
{
  ".is": "enum",
  ".description": "This is a string enum.",

  "Boston": "Boston",
  "Budapest": ["Budapest", "The capital of Hungary."]
}
```

Enum types must not be mixed.

Interfaces can refer to the enum, or to a specific value in the enum:

```JSON
{
  ".is": "interface",
  ".description": "The city of Budapest.",
  
  "id": "./CityID.Budapest",
  "sisterCityId": "./CityID"
}
```

In the example above, the `"sisterCityId"` property can take any city ID.

On the other hand, the `"id"` property can only contain a single specific city ID. This pattern can be used to make sure each city gets its own unique ID.

Generators can provide assistance with enum value properties, generating a factory or making sure the value cannot be changed or identifying the correct city interface by ID.

## Configure

You can configure the generator by providing a JavaScript file in the `--config` parameter. Example:

**jsoncodegen-generator-typescript.config.js**

```js
module.exports = {
  // options
}
```

```
jsoncodegen --generator typescript --inputDir src --outputDir build --config jsoncodegen-generator-typescript.config.js
```

For available options, please check the documentation of the generator.

## Write your own generator

The `--generator` option also accepts a relative path to a JS file. Example:

```
jsoncodegen --generator ./my-generator.js --inputDir src --outputDir build
```

Have a look at https://github.com/jsoncodegen/types-for-generator to get an idea about the expected shape of a generator. You can install the types like this:

```
npm i -D jsoncodegen-types-for-generator
```

Generators should implement the IGenerator interface:

```TS
import { IGenerator, IGeneratorResult } from 'jsoncodegen-types-for-generator'

interface IConfig {
  // ... any configuration
}

const generator: IGenerator = {
  async generate(config: IConfig, namedTypesById) {
    let result: IGeneratorResult[] = []
    for (const namedType of namedTypesById.values()) {
      switch (namedType.kind) {
        case 'Interface':
        case 'NumberEnum':
        case 'StringEnum':
          result.push({
            filePath: [
              ...namedType.directoryPath,
              namedType.name + '.java',
            ],
            content: '...',
          })
          break
      }
    }
    return result
  },
}

module.exports = generator
```

Also, https://github.com/jsoncodegen/test-json has sample JSON you can use to test the output of your generator. You can install the sample JSON like this:

```
npm i -D jsoncodegen-test-json
```

## Licence

MIT

## Version history

1.0.0 Initial version.
