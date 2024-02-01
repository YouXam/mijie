# Test

Hello world

```python
print(123)
```

$$
E=mc^2
$$

<img :src="svg" />

<div class="mt-5">
    <button class="btn btn-primary" @click="pass">Pass</button>
    <button class="btn btn-primary" @click="nopass">NoPass</button>
</div>

<script setup>
import svg from './Abacus.drawio.svg'
import Button from './Button.vue'
import { inject } from 'vue'
const api = inject('api')
async function pass() {
    await api("pass", {msg:"一些信息"})
}
async function nopass() {
    await api("nopass", {msg:"一些信息"})
}
</script>