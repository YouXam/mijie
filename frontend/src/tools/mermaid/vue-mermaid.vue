<template>
  <div id="mermaid" class="mermaid" style="color: transparent">{{ parseCode }}</div>
</template>

<script>
import mermaid from "mermaid";
export default {
  name: "VueMermaid",
  props: {
    type: {
      type: String,
      default: "graph TD"
    },
    nodes: {
      type: Array,
      required: true
    },
    styles: {
      type: Array,
      default() {
        return [];
      }
    },
    config: {
      type: Object,
      default() {
        return {};
      }
    },
    defaultConfig: {
      type: Object,
      default() {
        return { theme: "default", startOnLoad: false, securityLevel: "loose" };
      }
    },
    stopOnError: {
      type: Boolean,
      default: false
    }
  },
  data: function() {
    return {
      edges: [
        { type: "default", open: "[", close: "]" },
        { type: "round", open: "(", close: ")" },
        { type: "stadium", open: "([", close: "])" },
        { type: "subroutine", open: "[[", close: "]]" },
        { type: "cylindrical", open: "[(", close: ")]" },
        { type: "circle", open: "((", close: "))" },
        { type: "asymetric", open: ">", close: "]" },
        { type: "rhombus", open: "{", close: "}" },
        { type: "hexagon", open: "{{", close: "}}" },
        { type: "parallelogram", open: "[/", close: "/]" },
        { type: "parallelogram_alt", open: "[\\", close: "\\]" },
        { type: "trapezoid", open: "[/", close: "\\]" },
        { type: "trapezoid_alt", open: "[\\", close: "/]" },
      ]
    };
  },
  mounted() {
    this.init();
    this.loadNodes();
  },
  computed: {
    nodeObject() {
      const { nodes } = this;
      if (Array.isArray(nodes) && nodes.length > 0) {
        const arrayToObject = (arr, keyField) =>
          Object.assign({}, ...arr.map(item => ({ [item[keyField]]: item })));
        return arrayToObject(nodes, "id");
      } else {
        return {};
      }
    },
    customStyle() {
      const { nodes, styles } = this;
      const nodeStyles = nodes
        .map(node => `style ${node.id} fill:#fff,stroke:#fff`);
      return nodeStyles.concat(styles)
    },
    parseCode() {
      const { nodes } = this;
      if (Array.isArray(nodes) && nodes.length > 0) {
        const parseCode = this.type + "\n";
        const groupNodes = this.getGroupNodes(nodes);
        const code = parseCode + groupNodes + this.customStyle.join(" \n") + "\nlinkStyle default stroke:white;";
        this.load(code);
        return code;
      } else {
        return "";
      }
    }
  },
  methods: {
    getGroupNodes(nodes) {
      const innerMap = new Map();
      nodes.forEach(element => {
        const group = element.group || "";
        const data = innerMap.get(group) || { nids: new Set(), narr: [] };
        data.nids.add(element.id);
        data.narr.push(element);
        innerMap.set(group, data);
      });
      return [...innerMap.entries()]
        .map(item => {
          const [groupName, entry] = item;
          const { nids, narr } = entry;
          if (groupName !== "") {
            const innerNodes = [];
            const outNodes = [];
            narr.forEach(node => {
              if (node.next) {
                innerNodes.push({
                  id: node.id,
                  text: node.text,
                  style: node.style
                });
                node.next.forEach(id => {
                  if (nids.has(id)) {
                    innerNodes.push({
                      id: node.id,
                      text: node.text,
                      link: node.link,
                      next: [id]
                    });
                  } else {
                    outNodes.push({
                      id: node.id,
                      text: node.text,
                      link: node.link,
                      next: [id]
                    });
                  }
                });
              } else {
                innerNodes.push(node);
              }
            });
            const innerNodesStr = this.buildNodesStr(innerNodes);
            const outNodeStr = this.buildNodesStr(outNodes);
            return `subgraph ${groupName} \n ${innerNodesStr} end \n ${outNodeStr}`;
          } else {
            const nodesStr = this.buildNodesStr(narr);
            return nodesStr;
          }
        })
        .join(" \n");
    },
    buildNodesStr(nodes) {
      return (
        nodes
          .map(item => {
            if (item.next && item.next.length > 0) {
              return item.next
                .map((n, index) => {
                  const next = this.nodeObject[n] || this.nodeObject[n.id];
                  if (next != null && typeof next != "undefined") {
                    return `${this.buildNode(item)}${this.buildLink(
                      item,
                      index
                    )}${this.buildNode(next)}`;
                  } else {
                    //TODO error
                    return `${this.buildNode(item)}`;
                  }
                })
                .join("\n");
            } else {
              return `${this.buildNode(item)}`;
            }
          })
          .join("\n") +
        "\n" +
        nodes
          .map(item => {
            return `click ${item.id} mermaidClick`;
          })
          .join("\n") +
        "\n" +
        nodes
          .filter(item => item.url)
          .map(item => {
            return `click ${item.id} "${item.url}"`;
          })
          .join("\n") +
        "\n"
      );
    },
    buildNode(item) {
      let edge = !item.edgeType
        ? this.edges.find(e => {
            return e.type === "default";
          })
        : this.edges.find(e => {
            return e.type === item.edgeType;
          });
      return `${item.id}(${item.text || item.id})`;
    },
    buildLink(item, index) {
      const link = "-->";
      if (item.link) {
        if (Array.isArray(item.link)) {
          if (item.link.length > index) return item.link[index];
          else return item.link[item.link.length - 1];
        } else {
          return item.link;
        }
      }
      return link;
    },
    loadNodes() {
      this.load(this.parseCode);
    },
    init() {
      const _t = this;
      window.mermaidClick = function(id) {
        _t.edit(id);
      };
      const config = Object.assign(this.defaultConfig, this.config)
      mermaid.initialize(config);
    },
    load(code) {
      if (code) {
        var container = document.getElementById("mermaid");
        if (container) {
          container.removeAttribute("data-processed");
          if (container.firstChild) {
            container.replaceChild(
              document.createTextNode(code),
              container.firstChild
            );
          } else {
            container.appendChild(document.createTextNode(code));
          }
          try {
            setTimeout(async () => {
              mermaid.run({
                querySelector: '.mermaid',
                postRenderCallback: (id) => {
                  document.querySelectorAll(".arrowMarkerPath").forEach(item => {
                    item.style.fill = "white";
                  });
                }
              });
            }, 0);
          } catch (error) {
            if (this.stopOnError) {
              throw error;
            }
          }
        }
      }
    },
    edit(id) {
      this.$emit("nodeClick", id);
    }
  }
};
</script>

