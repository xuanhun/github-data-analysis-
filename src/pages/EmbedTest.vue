<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4">
    <div class="max-w-6xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-800 mb-8">Embed Chart Test Page</h1>
      
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 class="text-xl font-semibold mb-4">Configuration</h2>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              GitHub Access Token
            </label>
            <input
              v-model="state.token"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your GitHub personal access token"
            />
            <p class="mt-1 text-xs text-gray-500">
              <a
                href="https://github.com/settings/tokens/new"
                target="_blank"
                class="text-blue-500 hover:underline"
              >
                Create a token
              </a>
              (no scope permission needed)
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Repositories (one per line)
            </label>
            <textarea
              v-model="state.reposInput"
              rows="4"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g.,&#10;star-history/star-history&#10;vuejs/vue"
            ></textarea>
            <p class="mt-1 text-xs text-gray-500">
              Format: owner/repo (one per line)
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Chart Mode
            </label>
            <select
              v-model="state.chartMode"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Date">Date</option>
              <option value="Timeline">Timeline</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Theme
            </label>
            <select
              v-model="state.theme"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 class="text-xl font-semibold mb-4">Generated Embed Code</h2>
        <div class="relative">
          <pre class="bg-gray-100 p-4 rounded-md overflow-x-auto text-sm"><code>{{ embedCode }}</code></pre>
          <button
            @click="copyEmbedCode"
            class="absolute top-2 right-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
          >
            Copy
          </button>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-xl font-semibold mb-4">Preview</h2>
        <div v-if="!canPreview" class="text-gray-500 text-center py-8">
          Please fill in the token and at least one repository to see the preview.
        </div>
        <div v-else class="border-2 border-gray-200 rounded-lg overflow-hidden">
          <iframe
            :src="embedUrl"
            style="width: 100%; height: 600px; border: none;"
            frameborder="0"
          ></iframe>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, reactive } from "vue";
import toast from "../helpers/toast";
import utils from "../../common/utils";

interface State {
  token: string;
  reposInput: string;
  chartMode: "Date" | "Timeline";
  theme: "light" | "dark";
}

const state = reactive<State>({
  token: "",
  reposInput: "star-history/star-history",
  chartMode: "Date",
  theme: "light",
});

const repos = computed(() => {
  return state.reposInput
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && line.includes("/"));
});

const embedUrl = computed(() => {
  if (!state.token || repos.value.length === 0) {
    return "";
  }
  const secret = btoa(state.token);
  return `${window.location.origin}/embed?secret=${secret}#${repos.value.join("&")}&${state.chartMode}`;
});

const embedCode = computed(() => {
  if (!state.token || repos.value.length === 0) {
    return "Please fill in the token and repositories to generate embed code.";
  }
  const secret = btoa(state.token);
  return `<iframe style="width:100%;height:auto;min-width:600px;min-height:400px;" src="${window.location.origin}/embed?secret=${secret}#${repos.value.join("&")}&${state.chartMode}" frameBorder="0"></iframe>`;
});

const canPreview = computed(() => {
  return state.token.length > 0 && repos.value.length > 0;
});

const copyEmbedCode = () => {
  if (!canPreview.value) {
    toast.warn("Please fill in the token and at least one repository");
    return;
  }
  utils.copyTextToClipboard(embedCode.value);
  toast.succeed("Embed code copied to clipboard!");
};
</script>
