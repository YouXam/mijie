本关的解锁条件为：前置的 6 个关卡中至少通过 5 关。

<p v-if="passed === -1">正在检查解锁条件...</p>
<p v-else-if="passed < 5">你已通过 {{ passed }} 关，未达成解锁条件。</p>
<p v-else>你已通过 {{ passed }} 关，<span v-if="first">请在下方进入最终关卡</span><span v-else>点击「跳过」以进入最终关卡</span>。</p>

<App />

<script setup>
import { inject, ref } from 'vue';
const api = inject('api');
const passed = ref(-1);
const first = ref(false);
api('refresh').then(data => {
    passed.value = data[0]
    first.value = data[1]
});
</script>