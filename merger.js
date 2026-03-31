// Advanced Schema Merger

function deepMerge(target, source) {
    for (const key in source) {
        if (source[key] instanceof Object && key in target) {
            Object.assign(source[key], deepMerge(target[key], source[key]));
        }
    }
    Object.assign(target || {}, source);
    return target;
}

function normalizeSchema(schema) {
    let obj = typeof schema === "string" ? JSON.parse(schema) : schema;

    delete obj["@context"];

    if (obj["@graph"]) {
        return obj["@graph"];
    }

    return [obj];
}

function mergeSchemas(schemaArray) {
    const graphMap = new Map();

    schemaArray.forEach(schema => {
        const nodes = normalizeSchema(schema);

        nodes.forEach(node => {
            const id = node["@id"] || JSON.stringify(node);

            if (graphMap.has(id)) {
                const existing = graphMap.get(id);
                graphMap.set(id, deepMerge(existing, node));
            } else {
                graphMap.set(id, node);
            }
        });
    });

    const merged = {
        "@context": "https://schema.org",
        "@graph": Array.from(graphMap.values())
    };

    return JSON.stringify(merged, null, 2);
}

export { mergeSchemas };
