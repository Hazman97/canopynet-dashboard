<template>
  <div class="farm-workers-container">
    <div class="header-section">
      <div class="header-content">
        <div class="title-section">
          <h1 class="main-title">My Farm Areas!</h1>
          <div class="area-stats">
            <div class="stat-item">
              <img src="@/assets/tree.png" alt="Trees Icon" class="stat-icon-img" />
              <span class="stat-text">{{ stats.totalTrees }} Trees</span>
            </div>
            <div class="stat-item">
              <img src="@/assets/block.png" alt="Blocks Icon" class="stat-icon-img" />
              <span class="stat-text">{{ stats.totalBlocks }} Blocks</span>
            </div>
            <div class="stat-item">
              <img src="@/assets/active-phase.png" alt="Phases Icon" class="stat-icon-img" />
              <span class="stat-text">{{ stats.totalPhases }} Phases</span>
            </div>
          </div>
        </div>
        <button @click="logout" class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition text-sm">
          Logout
        </button>
      </div>
    </div>

    <div class="workers-content">
      <div class="search-section">
        <div class="filter-buttons">
          <button @click="changeView('phases')" :class="['filter-btn', currentView === 'phases' && !currentPhase ? 'bg-orange-400 text-white' : '']">
            <img src="@/assets/map.png" alt="Phases Icon" class="h-6 w-6" />
            <span class="hidden md:inline">All Phases</span>
          </button>
          <button @click="changeView('blocks')" :class="['filter-btn', currentView === 'blocks' && !currentPhase ? 'bg-orange-400 text-white' : '']">
            <img src="@/assets/block.png" alt="Blocks Icon" class="h-6 w-6" />
            <span class="hidden md:inline">All Blocks</span>
          </button>
          <button @click="changeView('trees')" :class="['filter-btn', currentView === 'trees' && !currentBlock ? 'bg-orange-400 text-white' : '']">
            <img src="@/assets/tree.png" alt="Trees Icon" class="h-6 w-6" />
            <span class="hidden md:inline">All Trees</span>
          </button>
          <button v-if="currentView === 'phases'" @click="openCreateModal" class="add-worker-btn" title="Add New Phase">
            <span class="plus-icon">+</span>
            <span class="hidden md:inline">Add New Phase</span>
          </button>
          <button v-else-if="currentView === 'blocks'" @click="openBlockModal" class="add-worker-btn" title="Add New Block">
            <span class="plus-icon">+</span>
            <span class="hidden md:inline">Add New Block</span>
          </button>
          <button v-else-if="currentView === 'trees'" @click="openTreeModal" class="add-worker-btn" title="Add New Tree">
            <span class="plus-icon">+</span>
            <span class="hidden md:inline">Add New Tree</span>
          </button>
        </div>

        <div class="search-and-filter-bar">
          <div class="search-bar">
            <span class="search-icon">🔍</span>
            <input
              v-model="searchTerm"
              type="text"
              placeholder="Search..."
              class="search-input"
            />
          </div>

          <div class="relative">
            <select
              v-model="statusFilter"
              class="filter-btn appearance-none"
            >
              <option v-for="status in statusOptions" :key="status" :value="status">{{ status }}</option>
            </select>
          </div>
        </div>
        <h2 class="text-white text-xl font-bold mt-4">
          <span v-for="(path, index) in navigationPath" :key="index">
            <span
              :class="['cursor-pointer', 'hover:underline', { 'text-orange-300': index === navigationPath.length - 1 }]"
              @click="path.action()"
              v-html="path.name"
            ></span>
            <span v-if="index < navigationPath.length - 1" class="mx-2">/</span>
          </span>
        </h2>
      </div>

      <div class="workers-grid">
        <div v-for="item in filteredItems" :key="item.id"
          :class="['worker-card', statusConfig[currentView][item.status]?.color]">
          <div class="p-6">
            <div class="flex justify-between items-start mb-4">
              <div class="flex items-center">
                <img :src="statusConfig[currentView][item.status]?.icon" alt="Status Icon" class="h-6 w-6 mr-3" />
                <div>
                  <h3 class="text-xl font-bold">
                    <span v-if="currentView === 'phases'">Phase {{ item.phaseNumber }} -</span>
                    <span v-else-if="currentView === 'blocks'">Block {{ item.blockNumber }} -</span>
                    <span v-else-if="currentView === 'trees'">Tree {{ item.treeNumber }} -</span>
                    {{ item.name }}
                  </h3>
                  <span v-if="currentView !== 'trees'" :class="['status-chip', statusConfig[currentView][item.status]?.statusChipColor]">
                    {{ item.status }}
                  </span>
                  <p v-if="currentView === 'phases' || currentView === 'blocks'" class="text-gray-600 text-sm mt-1">{{ item.description }}</p>
                </div>
              </div>
              <div class="flex space-x-2">
                <button v-if="currentView !== 'trees'" @click="editItem(item)" class="edit-btn" title="Edit">
                  ✏️
                </button>
                <button v-else @click="editItem(item)" class="edit-btn-tree" title="Edit">
                  ✏️
                </button>
                <button @click="deleteItem(item.id)" class="delete-btn" title="Delete">
                  🗑️
                </button>
              </div>
            </div>

            <div class="text-gray-700 space-y-2 mb-4">
              <p v-if="currentView === 'phases' || currentView === 'blocks'">
                <img src="@/assets/tree.png" alt="Tree" class="inline-block h-4 w-4 mr-2" /> Total Trees: {{ item.totalTrees }}
              </p>
              <p v-if="currentView === 'phases'">
                <img src="@/assets/block.png" alt="Block" class="inline-block h-4 w-4 mr-2" /> Total Blocks: {{ item.totalBlocks }}
              </p>
              <p v-if="currentView === 'phases' || currentView === 'blocks'">
                <span class="inline-block h-4 w-4 mr-2">📅</span> Established: {{ item.established }}
              </p>
              <p v-if="currentView === 'phases' || currentView === 'blocks'">
                <span class="inline-block h-4 w-4 mr-2">📐</span> Total Area: {{ item.totalArea }} ha
              </p>
              <p v-if="currentView === 'blocks'">
                <img src="@/assets/information.png" alt="Variety" class="inline-block h-4 w-4 mr-2" /> Variety: {{ item.variety }}
              </p>
              <div v-if="currentView === 'trees'" class="grid grid-cols-2 gap-y-2 text-sm">
                  <div class="flex items-center">
                    <img src="@/assets/hospital.png" alt="Status" class="inline-block h-4 w-4 mr-2" />
                    <span>Status: {{ item.status }}</span>
                  </div>
                  <div class="flex items-center">
                    <span class="inline-block h-4 w-4 mr-2">📍</span>
                    <span>Location: {{ item.location }}</span>
                  </div>
                  <div class="flex items-center">
                    <img src="@/assets/tree.png" alt="Variety" class="inline-block h-4 w-4 mr-2" />
                    <span>Variety: {{ item.variety }}</span>
                  </div>
                  <div class="flex items-center">
                    <img src="@/assets/qr-code.png" alt="Tag" class="inline-block h-4 w-4 mr-2" />
                    <span>Tag: {{ item.tag }}</span>
                  </div>
                  <div class="flex items-center">
                    <span class="inline-block h-4 w-4 mr-2">🎂</span>
                    <span>Age: {{ item.age }}</span>
                  </div>
                  <div class="flex items-center">
                    <span class="inline-block h-4 w-4 mr-2">📏</span>
                    <span>Height: {{ item.height }}m</span>
                  </div>
                  <div class="flex items-center">
                    <span class="inline-block h-4 w-4 mr-2">📅</span>
                    <span>Last Check: {{ item.lastCheck }}</span>
                  </div>
                  <div v-if="item.diseases && item.diseases.length" class="col-span-2 flex items-center flex-wrap">
                      <img src="@/assets/disease.png" alt="Disease" class="inline-block h-4 w-4 mr-2" />
                      <span class="font-bold mr-1">Diseases:</span>
                      <span v-for="(disease, dIndex) in item.diseases" :key="dIndex" class="bg-red-200 text-red-800 text-xs font-semibold px-2.5 py-0.5 rounded-full mr-1">{{ disease }}</span>
                  </div>
              </div>
            </div>

            <div class="flex justify-end">
              <button v-if="currentView === 'phases'" @click="viewBlocks(item)" class="bg-orange-400 hover:bg-orange-500 text-white px-4 py-2 rounded-lg font-medium">
                View Block
              </button>
              <button v-else-if="currentView === 'blocks'" @click="viewTrees(item)" class="bg-orange-400 hover:bg-orange-500 text-white px-4 py-2 rounded-lg font-medium">
                View Tree
              </button>
              
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="showCreateModal"
      class="fixed inset-0 modal-overlay-bg flex items-center justify-center z-50 p-4"
      @click="closeModal"
    >
      <div
        class="modal-content"
        @click.stop
      >
        <div class="modal-header">
          <h2>{{ isEditing ? 'Edit Phase' : 'Add New Phase' }}</h2>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="modal-left-panel">
              <div>
                <h3 class="text-lg font-bold text-white mb-4">Status List:</h3>
                <p class="text-white mb-4 text-sm">Pick your phase status!</p>
                <div class="space-y-3">
                  <div
                    v-for="status in statusTypes"
                    :key="status.name"
                    class="modal-list-item"
                    @click="selectStatus(status)"
                    draggable="true"
                    @dragstart="dragStatus(status)"
                  >
                    <span class="text-2xl">
                      <img
                        :src="getStatusIcon(status.name)"
                        class="w-8 h-8 object-contain"
                        :alt="status.name"
                      />
                    </span>
                    <span class="font-bold">{{ status.name }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="space-y-4">
              <div>
                <label class="block text-sm font-bold mb-2">Phase Number:</label>
                <input
                  v-model="newPhase.phaseNumber"
                  type="number"
                  class="form-input"
                  placeholder="Enter phase number"
                />
              </div>
              
              <div>
                <label class="block text-sm font-bold mb-2">Phase Name:</label>
                <input
                  v-model="newPhase.name"
                  type="text"
                  class="form-input"
                  placeholder="e.g. Kawasan Penyelidikan"
                />
              </div>

              <div>
                <label class="block text-sm font-bold mb-2">Total Area (ha):</label>
                <input
                  v-model="newPhase.totalArea"
                  type="number"
                  step="0.1"
                  class="form-input"
                  placeholder="e.g. 250.5"
                />
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-bold mb-2">Status:</label>
                  <div
                    class="form-input-drop-area"
                    @drop="dropStatus"
                    @dragover.prevent
                    @click="focusOnStatusPanel"
                  >
                    <div v-if="newPhase.status" class="flex items-center gap-2">
                      <img
                        :src="getStatusIcon(newPhase.status)"
                        class="w-6 h-6"
                        :alt="newPhase.status"
                      />
                      <span>{{ newPhase.status }}</span>
                    </div>
                    <span v-else class="cursor-pointer">Drag and drop the status!</span>
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-bold mb-2">Established Date:</label>
                  <div class="relative">
                    <input
                      v-model="newPhase.established"
                      type="date"
                      class="form-input"
                    />
                    <div class="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                      <svg class="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label class="block text-sm font-bold mb-2">Description:</label>
                <textarea
                  v-model="newPhase.description"
                  class="form-input min-h-[100px]"
                  placeholder="Describe the purpose of this phase..."
                  rows="4"
                ></textarea>
              </div>
            </div>
          </div>

          <div class="flex justify-end gap-2 mt-6">
            <button
              @click="closeModal"
              class="cancel-btn"
            >
              Cancel
            </button>
            <button
              v-if="!isEditing"
              @click="savePhase"
              class="add-btn"
            >
              Add
            </button>
            <button
              v-else
              @click="updatePhase"
              class="add-btn bg-blue-500 hover:bg-blue-600"
            >
              Update
            </button>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="showBlockModal"
      class="fixed inset-0 modal-overlay-bg flex items-center justify-center z-50 p-4"
      @click="closeBlockModal"
    >
      <div
        class="modal-content"
        @click.stop
      >
        <div class="modal-header">
          <h2>{{ isEditing ? 'Edit Block' : 'Add New Block' }}</h2>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="modal-left-panel">
              <div>
                <h3 class="text-lg font-bold text-white mb-4">Status List:</h3>
                <p class="text-white mb-4 text-sm">Pick your block status!</p>
                <div class="space-y-3">
                  <div
                    v-for="status in blockStatusTypes"
                    :key="status.name"
                    class="modal-list-item"
                    @click="selectBlockStatus(status)"
                    draggable="true"
                    @dragstart="dragBlockStatus(status)"
                  >
                    <span class="text-2xl">
                      <img
                        :src="getBlockStatusIcon(status.name)"
                        class="w-8 h-8 object-contain"
                        :alt="status.name"
                      />
                    </span>
                    <span class="font-bold">{{ status.name }}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-bold mb-2">Block Number:</label>
                <input
                  v-model="newBlock.blockNumber"
                  type="number"
                  class="form-input"
                  placeholder="Enter block number"
                />
              </div>

              <div>
                <label class="block text-sm font-bold mb-2">Block Name:</label>
                <input
                  v-model="newBlock.name"
                  type="text"
                  class="form-input"
                  placeholder="e.g. Penyelidikan Variasi Baharu"
                />
              </div>

              <div>
                <label class="block text-sm font-bold mb-2">Total Area (ha):</label>
                <input
                  v-model="newBlock.totalArea"
                  type="number"
                  step="0.1"
                  class="form-input"
                  placeholder="e.g. 50.0"
                />
              </div>

              <div>
                <label class="block text-sm font-bold mb-2">Variety:</label>
                <input
                  v-model="newBlock.variety"
                  type="text"
                  class="form-input"
                  placeholder="e.g. Pisifera"
                />
              </div>
              
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-bold mb-2">Status:</label>
                  <div
                    class="form-input-drop-area"
                    @drop="dropBlockStatus"
                    @dragover.prevent
                  >
                    <div v-if="newBlock.status" class="flex items-center gap-2">
                      <img
                        :src="getBlockStatusIcon(newBlock.status)"
                        class="w-6 h-6"
                        :alt="newBlock.status"
                      />
                      <span>{{ newBlock.status }}</span>
                    </div>
                    <span v-else class="cursor-pointer">Drag and drop the status!</span>
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-bold mb-2">Established Date:</label>
                  <div class="relative">
                    <input
                      v-model="newBlock.established"
                      type="date"
                      class="form-input"
                    />
                    <div class="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                      <svg class="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label class="block text-sm font-bold mb-2">Description:</label>
                <textarea
                  v-model="newBlock.description"
                  class="form-input min-h-[100px]"
                  placeholder="Describe the purpose of this block..."
                  rows="4"
                ></textarea>
              </div>
            </div>
          </div>
          <div class="flex justify-end gap-2 mt-6">
            <button
              @click="closeBlockModal"
              class="cancel-btn"
            >
              Cancel
            </button>
            <button
              v-if="!isEditing"
              @click="saveBlock"
              class="add-btn"
            >
              Add
            </button>
            <button
              v-else
              @click="updateBlock"
              class="add-btn bg-blue-500 hover:bg-blue-600"
            >
              Update
            </button>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="showTreeModal"
      class="fixed inset-0 modal-overlay-bg flex items-center justify-center z-50 p-4"
      @click="closeTreeModal"
    >
      <div
        class="modal-content"
        @click.stop
      >
        <div class="modal-header">
          <h2>{{ isEditing ? 'Edit Tree' : 'Add New Tree' }}</h2>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="modal-left-panel">
              <div>
                <h3 class="text-lg font-bold text-white mb-4">Health Status List:</h3>
                <p class="text-white mb-4 text-sm">Pick your tree health status!</p>
                <div class="space-y-3">
                  <div
                    v-for="status in treeStatusTypes"
                    :key="status.name"
                    class="modal-list-item"
                    @click="selectTreeStatus(status)"
                    draggable="true"
                    @dragstart="dragTreeStatus(status)"
                  >
                    <span class="text-2xl">
                      <img
                        :src="getTreeStatusIcon(status.name)"
                        class="w-8 h-8 object-contain"
                        :alt="status.name"
                      />
                    </span>
                    <span class="font-bold">{{ status.name }}</span>
                  </div>
                </div>
              </div>
              <div class="mt-6">
                <h3 class="text-lg font-bold text-white mb-4">Palm Variety:</h3>
                <div class="flex gap-2 mb-2">
                  <input v-model="newVarietyName" type="text" placeholder="Add New Variety" class="flex-grow rounded-lg p-2 text-black" />
                  <button @click="addNewVariety" class="bg-blue-500 text-white px-4 py-2 rounded-lg">+</button>
                </div>
                <div class="space-y-3">
                  <div
                    v-for="variety in palmVarieties"
                    :key="variety"
                    class="modal-list-item"
                    @click="selectVariety(variety)"
                    draggable="true"
                    @dragstart="dragVariety(variety)"
                  >
                    <span class="text-2xl">
                      <img src="@/assets/tree.png" class="w-8 h-8 object-contain" :alt="variety" />
                    </span>
                    <span class="font-bold">{{ variety }}</span>
                  </div>
                </div>
              </div>
              <div class="mt-6">
                <h3 class="text-lg font-bold text-white mb-4">Disease:</h3>
                <div class="flex gap-2 mb-2">
                  <input v-model="newDiseaseName" type="text" placeholder="Add New Disease" class="flex-grow rounded-lg p-2 text-black" />
                  <button @click="addNewDisease" class="bg-blue-500 text-white px-4 py-2 rounded-lg">+</button>
                </div>
                <div class="space-y-3">
                  <div
                    v-for="disease in diseasesList"
                    :key="disease"
                    class="modal-list-item"
                    @click="selectDisease(disease)"
                    draggable="true"
                    @dragstart="dragDisease(disease)"
                  >
                    <span class="text-2xl">
                      <img src="@/assets/disease.png" class="w-8 h-8 object-contain" :alt="disease" />
                    </span>
                    <span class="font-bold">{{ disease }}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-bold mb-2">Tree Number:</label>
                <input
                  v-model="newTree.treeNumber"
                  type="text"
                  class="form-input"
                  placeholder="e.g. T001"
                />
              </div>

              <div>
                <label class="block text-sm font-bold mb-2">Tag QR:</label>
                <input
                  v-model="newTree.tag"
                  type="text"
                  class="form-input"
                  placeholder="e.g. QR001"
                />
              </div>

              <div>
                <label class="block text-sm font-bold mb-2">Age:</label>
                <input
                  v-model="newTree.age"
                  type="text"
                  class="form-input"
                  placeholder="e.g. 1 years old"
                />
              </div>

              <div>
                <label class="block text-sm font-bold mb-2">Height (m):</label>
                <input
                  v-model="newTree.height"
                  type="number"
                  step="0.1"
                  class="form-input"
                  placeholder="e.g. 2.5"
                />
              </div>
              
              <div>
                <label class="block text-sm font-bold mb-2">Health Status:</label>
                <div
                  class="form-input-drop-area"
                  @drop="dropTreeStatus"
                  @dragover.prevent
                >
                  <div v-if="newTree.status" class="flex items-center gap-2">
                    <img
                      :src="getTreeStatusIcon(newTree.status)"
                      class="w-6 h-6"
                      :alt="newTree.status"
                    />
                    <span>{{ newTree.status }}</span>
                  </div>
                  <span v-else class="cursor-pointer">Drag and drop the health status!</span>
                </div>
              </div>

              <div>
                <label class="block text-sm font-bold mb-2">Last Check Date:</label>
                <div class="relative">
                  <input
                    v-model="newTree.lastCheck"
                    type="date"
                    class="form-input"
                  />
                  <div class="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                    <svg class="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"/>
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label class="block text-sm font-bold mb-2">Palm Variety:</label>
                <div
                  class="form-input-drop-area"
                  @drop="dropVariety"
                  @dragover.prevent
                >
                  <div v-if="newTree.variety" class="flex items-center gap-2">
                    <img src="@/assets/tree.png" class="w-6 h-6" :alt="newTree.variety" />
                    <span>{{ newTree.variety }}</span>
                  </div>
                  <span v-else class="cursor-pointer">Drag and drop a variety!</span>
                </div>
              </div>

              <div>
                <label class="block text-sm font-bold mb-2">Disease:</label>
                <div
                  class="form-input-drop-area"
                  @drop="dropDisease"
                  @dragover.prevent
                >
                  <div v-if="newTree.diseases.length > 0" class="flex items-center gap-2 flex-wrap">
                    <span v-for="disease in newTree.diseases" :key="disease" class="bg-red-200 text-red-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">{{ disease }}</span>
                  </div>
                  <span v-else class="cursor-pointer">Drag and drop diseases!</span>
                </div>
              </div>
            </div>
          </div>
          <div class="flex justify-end gap-2 mt-6">
            <button
              @click="closeTreeModal"
              class="cancel-btn"
            >
              Cancel
            </button>
            <button
              v-if="!isEditing"
              @click="saveTree"
              class="add-btn"
            >
              Add
            </button>
            <button
              v-else
              @click="updateTree"
              class="add-btn bg-blue-500 hover:bg-blue-600"
            >
              Update
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="fixed bottom-0 left-0 right-0 bg-white shadow-inner border-t flex justify-around py-2">
      <div @click="$router.push('/game-platform')" class="flex flex-col items-center cursor-pointer hover:text-green-700 transition">
        <img src="@/assets/house.png" class="w-8 mb-1" alt="Home" />
        <span class="text-sm">Home</span>
      </div>
      <div @click="$router.push('/game-tasks')" class="flex flex-col items-center cursor-pointer hover:text-yellow-700 transition">
        <img src="@/assets/task.png" class="w-8 mb-1" alt="Tasks" />
        <span class="text-sm">Tasks</span>
      </div>
      <div @click="$router.push('/game-workers')" class="flex flex-col items-center cursor-pointer hover:text-red-700 transition">
        <img src="@/assets/crew.png" class="w-8 mb-1" alt="Crew" />
        <span class="text-sm">Crew</span>
      </div>
      <div @click="$router.push('/game-areas')" class="flex flex-col items-center text-blue-700 font-bold">
        <img src="@/assets/map.png" class="w-8 mb-1" alt="Areas" />
        <span class="text-sm">Areas</span>
      </div>
      <div @click="$router.push('/game-assets')" class="flex flex-col items-center cursor-pointer hover:text-black-700 transition">
        <img src="@/assets/tractor.png" class="w-8 mb-1" alt="Assets" />
        <span class="text-sm">Assets</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

// Import all necessary images
import activePhaseIcon from '@/assets/active-phase.png';
import inactiveIcon from '@/assets/inactive.png';
import developmentIcon from '@/assets/development.png';
import maintenanceIcon from '@/assets/maintenance.png';
import youngPalmIcon from '@/assets/young-palm.png';
import harvestingIcon from '@/assets/harvesting.png';
import replantIcon from '@/assets/replant.png';
import healthyIcon from '@/assets/healthy.png';
import observationIcon from '@/assets/observation.png';
import diseasedIcon from '@/assets/diseased.png';
import diseaseIcon from '@/assets/disease.png';
import treeIcon from '@/assets/tree.png';
import qrCodeIcon from '@/assets/qr-code.png';
import palmIcon from '@/assets/tree.png';
import informationIcon from '@/assets/information.png';
import blockIcon from '@/assets/block.png';

const currentDate = ref(new Date().toISOString().slice(0, 10));

const currentView = ref('phases');
const currentPhase = ref(null);
const currentBlock = ref(null);
const showCreateModal = ref(false);
const showBlockModal = ref(false);
const showTreeModal = ref(false);
const selectedItem = ref(null);
const searchTerm = ref('');
const statusFilter = ref('All Status');
const isEditing = ref(false);

const phases = ref([
  {
    id: 1,
    name: 'Kawasan Penyelidikan',
    phaseNumber: 1,
    status: 'Active',
    established: '2024-10-20',
    totalArea: 250,
    totalTrees: 57,
    totalBlocks: 12,
    description: 'Digunakan untuk penyelidikan pokok variasi baharu',
    blocks: [
      {
        id: 1,
        name: 'Penyelidikan Variasi Baharu',
        blockNumber: 1,
        status: 'Active',
        established: '2024-10-20',
        totalArea: 250,
        totalTrees: 57,
        variety: 'Pisifera',
        age: '1 years old',
        description: 'Research block for new variety studies',
        trees: [
          {
            id: 'T001',
            treeNumber: 'T001',
            tag: 'QR001',
            status: 'Healthy',
            age: '1 years old',
            height: 2.5,
            lastCheck: '2024-09-28',
            variety: 'Pisifera',
            diseases: [],
            location: 'Phase 1 - Block 1'
          },
          {
            id: 'T002',
            treeNumber: 'T002',
            tag: 'QR002',
            status: 'Diseased',
            age: '1 years old',
            height: 2.5,
            lastCheck: '2024-09-28',
            variety: 'Pisifera',
            diseases: ['Ganoderma', 'Leaf Spot'],
            location: 'Phase 1 - Block 1'
          }
        ]
      }
    ]
  },
  {
    id: 2,
    name: 'Kawasan Penanaman',
    phaseNumber: 2,
    status: 'Active',
    established: '2024-10-20',
    totalArea: 250,
    totalTrees: 57,
    totalBlocks: 12,
    description: 'Main planting area for commercial production',
    blocks: [{
      id: 2,
      name: 'New Plantation',
      blockNumber: 1,
      status: 'Young Palm',
      established: '2025-08-15',
      totalArea: 50,
      totalTrees: 250,
      variety: 'Dura',
      age: '6 months old',
      description: 'Newly planted block for commercial production',
      trees: [{
        id: 'T003',
        treeNumber: 'T003',
        tag: 'QR003',
        status: 'Healthy',
        age: '6 months old',
        height: 1.0,
        lastCheck: '2025-08-15',
        variety: 'Dura',
        diseases: [],
        location: 'Phase 2 - Block 1'
      }]
    }],
  },
  {
    id: 3,
    name: 'Kawasan Pembangunan',
    phaseNumber: 3,
    status: 'Development',
    established: '2024-10-20',
    totalArea: 250,
    totalTrees: 57,
    totalBlocks: 12,
    description: 'Development area for future expansion',
    blocks: [],
  },
  {
    id: 4,
    name: 'Kawasan Penyelenggaraan',
    phaseNumber: 4,
    status: 'Maintenance',
    established: '2024-10-20',
    totalArea: 250,
    totalTrees: 57,
    totalBlocks: 12,
    description: 'Maintenance area for rehabilitation',
    blocks: [],
  },
  {
    id: 5,
    name: 'Kawasan Tidak Aktif',
    phaseNumber: 5,
    status: 'Inactive',
    established: '2024-10-20',
    totalArea: 250,
    totalTrees: 57,
    totalBlocks: 12,
    description: 'Currently inactive area',
    blocks: [],
  }
]);

// Status types for drag and drop
const statusTypes = ref([
  { name: 'Active', iconPath: activePhaseIcon, color: '#4caf50' },
  { name: 'Inactive', iconPath: inactiveIcon, color: '#9e9e9e' },
  { name: 'Development', iconPath: developmentIcon, color: '#2196f3' },
  { name: 'Maintenance', iconPath: maintenanceIcon, color: '#ffeb3b' }
]);

const blockStatusTypes = ref([
  { name: 'Young Palm', iconPath: youngPalmIcon },
  { name: 'Active', iconPath: activePhaseIcon },
  { name: 'Harvesting', iconPath: harvestingIcon },
  { name: 'Maintenance', iconPath: maintenanceIcon },
  { name: 'Replanting', iconPath: replantIcon }
]);

const treeStatusTypes = ref([
  { name: 'Healthy', iconPath: healthyIcon },
  { name: 'Under Observation', iconPath: observationIcon },
  { name: 'Diseased', iconPath: diseasedIcon }
]);

const palmVarieties = ref(['Tenera', 'Dura', 'Pisifera']);
const newVarietyName = ref('');
const diseasesList = ref(['Ganoderma', 'Leaf Spot']);
const newDiseaseName = ref('');

const newPhase = ref({
  id: null,
  phaseNumber: null,
  name: '',
  status: '',
  established: '',
  totalArea: null,
  description: '',
  totalTrees: 0,
  totalBlocks: 0,
  blocks: []
});

const newBlock = ref({
  id: null,
  blockNumber: null,
  name: '',
  totalArea: null,
  status: '',
  variety: '',
  established: '',
  description: '',
  totalTrees: 0,
  trees: []
});

const newTree = ref({
  id: null,
  treeNumber: '',
  tag: '',
  status: '',
  age: '',
  height: null,
  variety: '',
  lastCheck: '',
  diseases: [],
  location: ''
});

const draggedItem = ref(null);

const statusConfig = {
  phases: {
    'Active': { color: 'border-green-400', icon: activePhaseIcon, statusChipColor: 'bg-green-500' },
    'Inactive': { color: 'border-gray-400', icon: inactiveIcon, statusChipColor: 'bg-gray-500' },
    'Development': { color: 'border-blue-400', icon: developmentIcon, statusChipColor: 'bg-blue-500' },
    'Maintenance': { color: 'border-yellow-400', icon: maintenanceIcon, statusChipColor: 'bg-yellow-500' }
  },
  blocks: {
    'Young Palm': { color: 'border-blue-400', icon: youngPalmIcon, statusChipColor: 'bg-blue-500' },
    'Active': { color: 'border-green-400', icon: activePhaseIcon, statusChipColor: 'bg-green-500' },
    'Harvesting': { color: 'border-purple-400', icon: harvestingIcon, statusChipColor: 'bg-purple-500' },
    'Maintenance': { color: 'border-yellow-400', icon: maintenanceIcon, statusChipColor: 'bg-yellow-500' },
    'Replanting': { color: 'border-indigo-400', icon: replantIcon, statusChipColor: 'bg-indigo-500' }
  },
  trees: {
    'Healthy': { color: 'border-green-400', icon: healthyIcon },
    'Under Observation': { color: 'border-yellow-400', icon: observationIcon },
    'Diseased': { color: 'border-red-400', icon: diseasedIcon }
  }
};

const allBlocks = computed(() => {
  const blocks = [];
  phases.value.forEach(phase => {
    if (phase.blocks) {
      phase.blocks.forEach(block => {
        blocks.push({ ...block, phaseId: phase.id, phaseName: phase.name });
      });
    }
  });
  return blocks;
});

const allTrees = computed(() => {
  const trees = [];
  phases.value.forEach(phase => {
    if (phase.blocks) {
      phase.blocks.forEach(block => {
        if (block.trees) {
          block.trees.forEach(tree => {
            trees.push({ ...tree, blockId: block.id, blockName: block.name, phaseId: phase.id, phaseName: phase.name });
          });
        }
      });
    }
  });
  return trees;
});

const getTotalStats = () => {
  const totalPhases = phases.value.length;
  const totalBlocks = allBlocks.value.length;
  const totalTrees = allTrees.value.length;
  return { totalPhases, totalBlocks, totalTrees };
};

const stats = computed(getTotalStats);

const filteredItems = computed(() => {
  let items = [];

  if (currentView.value === 'phases') {
    items = phases.value;
  } else if (currentView.value === 'blocks') {
    items = currentPhase.value ? currentPhase.value.blocks : allBlocks.value;
  } else if (currentView.value === 'trees') {
    items = currentBlock.value ? currentBlock.value.trees : allTrees.value;
  }

  if (searchTerm.value) {
    items = items.filter(item =>
      Object.values(item).some(value =>
        value && value.toString().toLowerCase().includes(searchTerm.value.toLowerCase())
      )
    );
  }

  if (statusFilter.value !== 'All Status') {
    items = items.filter(item => item.status === statusFilter.value);
  }

  return items;
});

const statusOptions = computed(() => {
  if (currentView.value === 'phases') {
    return ['All Status', 'Active', 'Inactive', 'Development', 'Maintenance'];
  } else if (currentView.value === 'blocks') {
    return ['All Status', 'Young Palm', 'Active', 'Harvesting', 'Maintenance', 'Replanting'];
  } else if (currentView.value === 'trees') {
    return ['All Status', 'Healthy', 'Under Observation', 'Diseased'];
  }
  return ['All Status'];
});

const navigationPath = computed(() => {
  const path = [];
  path.push({ name: `Phases (${phases.value.length})`, action: goBackToPhases });
  if (currentPhase.value) {
    path.push({ name: `Phase ${currentPhase.value.phaseNumber} - ${currentPhase.value.name}`, action: goBackToBlocks });
  }
  if (currentBlock.value) {
    path.push({ name: `Block ${currentBlock.value.blockNumber} - ${currentBlock.value.name}`, action: goBackToBlocks });
  }

  return path;
});

const openCreateModal = () => {
  isEditing.value = false;
  showCreateModal.value = true;
  resetNewPhase();
};

const closeModal = () => {
  showCreateModal.value = false;
  resetNewPhase();
};

const openBlockModal = () => {
  isEditing.value = false;
  showBlockModal.value = true;
  resetNewBlock();
};

const closeBlockModal = () => {
  showBlockModal.value = false;
  resetNewBlock();
};

const openTreeModal = () => {
  isEditing.value = false;
  showTreeModal.value = true;
  resetNewTree();
};

const closeTreeModal = () => {
  showTreeModal.value = false;
  resetNewTree();
};

const resetNewPhase = () => {
  newPhase.value = {
    id: null,
    phaseNumber: null,
    name: '',
    status: '',
    established: '',
    totalArea: null,
    description: '',
    totalTrees: 0,
    totalBlocks: 0,
    blocks: []
  };
  draggedItem.value = null;
};

const resetNewBlock = () => {
  newBlock.value = {
    id: null,
    blockNumber: null,
    name: '',
    totalArea: null,
    status: '',
    variety: '',
    established: '',
    description: '',
    totalTrees: 0,
    trees: []
  };
  draggedItem.value = null;
};

const resetNewTree = () => {
  newTree.value = {
    id: null,
    treeNumber: '',
    tag: '',
    status: '',
    age: '',
    height: null,
    variety: '',
    lastCheck: '',
    diseases: [],
    location: ''
  };
  draggedItem.value = null;
};

// Drag and drop methods for phases
const dragStatus = (status) => {
  draggedItem.value = { type: 'status', data: status };
};

const selectStatus = (status) => {
  newPhase.value.status = status.name;
};

const dropStatus = () => {
  if (draggedItem.value && draggedItem.value.type === 'status') {
    newPhase.value.status = draggedItem.value.data.name;
    draggedItem.value = null;
  }
};

// Drag and drop methods for blocks
const dragBlockStatus = (status) => {
  draggedItem.value = { type: 'blockStatus', data: status };
};

const selectBlockStatus = (status) => {
  newBlock.value.status = status.name;
};

const dropBlockStatus = () => {
  if (draggedItem.value && draggedItem.value.type === 'blockStatus') {
    newBlock.value.status = draggedItem.value.data.name;
    draggedItem.value = null;
  }
};

// Drag and drop methods for trees
const dragTreeStatus = (status) => {
  draggedItem.value = { type: 'treeStatus', data: status };
};

const selectTreeStatus = (status) => {
  newTree.value.status = status.name;
};

const dropTreeStatus = () => {
  if (draggedItem.value && draggedItem.value.type === 'treeStatus') {
    newTree.value.status = draggedItem.value.data.name;
    draggedItem.value = null;
  }
};

// Drag and drop methods for varieties
const dragVariety = (variety) => {
  draggedItem.value = { type: 'variety', data: variety };
};

const selectVariety = (variety) => {
  newTree.value.variety = variety;
};

const dropVariety = () => {
  if (draggedItem.value && draggedItem.value.type === 'variety') {
    newTree.value.variety = draggedItem.value.data;
    draggedItem.value = null;
  }
};

const addNewVariety = () => {
  if (newVarietyName.value && !palmVarieties.value.includes(newVarietyName.value)) {
    palmVarieties.value.push(newVarietyName.value);
    newVarietyName.value = '';
  }
};

// Drag and drop methods for diseases
const dragDisease = (disease) => {
  draggedItem.value = { type: 'disease', data: disease };
};

const selectDisease = (disease) => {
  if (!newTree.value.diseases.includes(disease)) {
    newTree.value.diseases.push(disease);
  } else {
    newTree.value.diseases = newTree.value.diseases.filter(d => d !== disease);
  }
};

const dropDisease = () => {
  if (draggedItem.value && draggedItem.value.type === 'disease') {
    const disease = draggedItem.value.data;
    if (!newTree.value.diseases.includes(disease)) {
      newTree.value.diseases.push(disease);
    }
    draggedItem.value = null;
  }
};

const addNewDisease = () => {
  if (newDiseaseName.value && !diseasesList.value.includes(newDiseaseName.value)) {
    diseasesList.value.push(newDiseaseName.value);
    newDiseaseName.value = '';
  }
};

const focusOnStatusPanel = () => {
  // This could be used to highlight the status panel when clicked
};

const getStatusIcon = (statusName) => {
  const status = statusTypes.value.find(s => s.name === statusName);
  return status ? status.iconPath : '';
};

const getBlockStatusIcon = (statusName) => {
  const status = blockStatusTypes.value.find(s => s.name === statusName);
  return status ? status.iconPath : '';
};

const getTreeStatusIcon = (statusName) => {
  const status = treeStatusTypes.value.find(s => s.name === statusName);
  return status ? status.iconPath : '';
};

// Function to save a new phase
const savePhase = () => {
  if (!newPhase.value.phaseNumber || !newPhase.value.name || !newPhase.value.status || 
      !newPhase.value.established || !newPhase.value.totalArea || !newPhase.value.description) {
    alert('Please fill in all required fields.');
    return;
  }

  const newId = phases.value.length > 0 ? Math.max(...phases.value.map(p => p.id)) + 1 : 1;
  const phaseToAdd = {
    ...newPhase.value,
    id: newId,
    totalTrees: 0,
    totalBlocks: 0,
    blocks: []
  };

  phases.value.push(phaseToAdd);
  closeModal();
  alert('New Phase added successfully!');
};

const saveBlock = () => {
  if (!currentPhase.value) {
    alert('No phase selected to add a block to.');
    return;
  }
  if (!newBlock.value.blockNumber || !newBlock.value.name || !newBlock.value.status ||
      !newBlock.value.established || !newBlock.value.totalArea || !newBlock.value.description) {
    alert('Please fill in all required fields.');
    return;
  }

  const newId = currentPhase.value.blocks.length > 0 ? Math.max(...currentPhase.value.blocks.map(b => b.id)) + 1 : 1;
  const blockToAdd = {
    ...newBlock.value,
    id: newId,
    totalTrees: 0,
    trees: []
  };
  currentPhase.value.blocks.push(blockToAdd);
  closeBlockModal();
  alert('New Block added successfully!');
};

const saveTree = () => {
  if (!currentBlock.value) {
    alert('No block selected to add a tree to.');
    return;
  }

  if (!newTree.value.treeNumber || !newTree.value.tag || !newTree.value.status || !newTree.value.age ||
      !newTree.value.height || !newTree.value.lastCheck || !newTree.value.variety) {
    alert('Please fill in all required fields.');
    return;
  }

  const newId = newTree.value.treeNumber;
  const treeToAdd = {
    ...newTree.value,
    id: newId,
    location: `Phase ${currentPhase.value.phaseNumber} - Block ${currentBlock.value.blockNumber}`
  };
  currentBlock.value.trees.push(treeToAdd);
  closeTreeModal();
  alert('New Tree added successfully!');
};

const editItem = (item) => {
  isEditing.value = true;
  if (currentView.value === 'phases') {
    showCreateModal.value = true;
    newPhase.value = { ...item };
  } else if (currentView.value === 'blocks') {
    showBlockModal.value = true;
    newBlock.value = { ...item };
  } else if (currentView.value === 'trees') {
    showTreeModal.value = true;
    newTree.value = { ...item };
  }
};

const updatePhase = () => {
  const index = phases.value.findIndex(p => p.id === newPhase.value.id);
  if (index !== -1) {
    phases.value[index] = { ...newPhase.value };
    closeModal();
    alert('Phase updated successfully!');
  } else {
    alert('Error: Phase not found.');
  }
};

const updateBlock = () => {
  if (!currentPhase.value) return;
  const index = currentPhase.value.blocks.findIndex(b => b.id === newBlock.value.id);
  if (index !== -1) {
    currentPhase.value.blocks[index] = { ...newBlock.value };
    closeBlockModal();
    alert('Block updated successfully!');
  } else {
    alert('Error: Block not found.');
  }
};

const updateTree = () => {
  if (!currentBlock.value) return;
  const index = currentBlock.value.trees.findIndex(t => t.id === newTree.value.id);
  if (index !== -1) {
    currentBlock.value.trees[index] = { ...newTree.value };
    closeTreeModal();
    alert('Tree updated successfully!');
  } else {
    alert('Error: Tree not found.');
  }
};

const viewBlocks = (phase) => {
  currentPhase.value = phase;
  currentView.value = 'blocks';
  searchTerm.value = '';
  statusFilter.value = 'All Status';
};

const viewTrees = (block) => {
  currentBlock.value = block;
  currentView.value = 'trees';
  searchTerm.value = '';
  statusFilter.value = 'All Status';
};

const goBackToBlocks = () => {
  currentView.value = 'blocks';
  currentBlock.value = null;
};

const goBackToPhases = () => {
  currentView.value = 'phases';
  currentPhase.value = null;
  currentBlock.value = null;
};

const changeView = (view) => {
  if (view === 'phases') {
    goBackToPhases();
  } else if (view === 'blocks') {
    currentView.value = 'blocks';
    currentPhase.value = null;
    currentBlock.value = null;
  } else if (view === 'trees') {
    currentView.value = 'trees';
    currentPhase.value = null;
    currentBlock.value = null;
  }
  searchTerm.value = '';
  statusFilter.value = 'All Status';
};

const logout = () => {
  if (confirm('Are you sure you want to log out?')) {
    console.log('Logging out...');
  }
};

const deleteItem = (itemId) => {
  if (confirm('Are you sure you want to delete this item?')) {
    if (currentView.value === 'phases') {
      const initialLength = phases.value.length;
      phases.value = phases.value.filter(phase => phase.id !== itemId);
      if (phases.value.length < initialLength) {
        alert('Phase deleted successfully!');
      }
    } else if (currentView.value === 'blocks' && currentPhase.value) {
      const initialLength = currentPhase.value.blocks.length;
      currentPhase.value.blocks = currentPhase.value.blocks.filter(block => block.id !== itemId);
      if (currentPhase.value.blocks.length < initialLength) {
        alert('Block deleted successfully!');
      }
    } else if (currentView.value === 'trees' && currentBlock.value) {
      const initialLength = currentBlock.value.trees.length;
      currentBlock.value.trees = currentBlock.value.trees.filter(tree => tree.id !== itemId);
      if (currentBlock.value.trees.length < initialLength) {
        alert('Tree deleted successfully!');
      }
    }
  }
};
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.farm-workers-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: 'Arial', sans-serif;
  padding-bottom: 80px;
  position: relative;
}

/* Header Styles */
.header-section {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 50%, #4facfe 100%);
  padding: 20px;
  border-radius: 0 0 30px 30px;
  margin-bottom: 20px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.title-section {
  flex: 1;
}

.main-title {
  color: white;
  font-size: 2.5rem;
  font-weight: bold;
  margin: 0 0 15px 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

/* New stats summary styles */
.area-stats {
  display: flex;
  gap: 20px;
  margin-top: 10px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.2);
  padding: 8px 16px;
  border-radius: 20px;
  color: white;
  font-weight: 600;
  backdrop-filter: blur(10px);
}

.stat-icon-img {
  height: 1.5rem;
  width: 1.5rem;
}

.stat-text {
  font-size: 1rem;
}

.workers-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.search-section {
  margin-bottom: 30px;
}

.filter-buttons {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.search-and-filter-bar {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
  align-items: center;
}

.search-bar {
  display: flex;
  align-items: center;
  background: white;
  border-radius: 25px;
  padding: 15px 20px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  flex-grow: 1;
}

.search-icon {
  margin-right: 10px;
  font-size: 1.2rem;
  color: #666;
}

.search-input {
  border: none;
  outline: none;
  flex: 1;
  font-size: 1rem;
  color: #333;
  background: transparent;
}

.search-input::placeholder {
  color: #999;
}

.filter-btn {
  background: rgba(255, 255, 255, 0.8);
  border: none;
  padding: 10px 20px;
  border-radius: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: #666;
  transition: all 0.3s ease;
  font-size: 1rem;
  backdrop-filter: blur(10px);
  text-align: center;
  width: auto;
}

.filter-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.filter-btn.bg-orange-400.text-white {
  background: #fb923c;
  color: white;
}

.add-worker-btn {
  background: #00d2ff;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 25px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
  font-size: 1rem;
}

.add-worker-btn:hover {
  background: #00b8e6;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.plus-icon {
  font-size: 1.2rem;
  font-weight: bold;
}

.workers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.worker-card {
  background: white;
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border: 3px solid transparent;
  position: relative;
  backdrop-filter: blur(10px);
}

.worker-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.worker-card.border-green-400 {
  border-color: #4caf50;
  background: linear-gradient(135deg, #c8e6c9 0%, #a5d6a7 100%);
}

.worker-card.border-gray-400 {
  border-color: #9e9e9e;
  background: linear-gradient(135deg, #e0e0e0 0%, #bdbdbd 100%);
}

.worker-card.border-blue-400 {
  border-color: #2196f3;
  background: linear-gradient(135deg, #bbdefb 0%, #90caf9 100%);
}

.worker-card.border-yellow-400 {
  border-color: #ffeb3b;
  background: linear-gradient(135deg, #fff9c4 0%, #ffee58 100%);
}

.worker-card.border-purple-400 {
  border-color: #9c27b0;
  background: linear-gradient(135deg, #e1bee7 0%, #ce93d8 100%);
}

.worker-card.border-indigo-400 {
  border-color: #3f51b5;
  background: linear-gradient(135deg, #c5cae9 0%, #9fa8da 100%);
}

.worker-card.border-red-400 {
  border-color: #f44336;
  background: linear-gradient(135deg, #ffcdd2 0%, #e57373 100%);
}

.edit-btn,
.delete-btn {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.edit-btn:hover {
  background: rgba(0, 0, 0, 0.1);
}

.delete-btn:hover {
  background: rgba(255, 0, 0, 0.1);
}

/* Modal Styles */
.modal-content {
  background: white;
  border-radius: 20px;
  max-width: 90%;
  width: 900px;
  max-height: 90vh;
  overflow: auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.modal-header {
  background: linear-gradient(135deg, #00d2ff 0%, #3a7bd5 100%);
  color: white;
  padding: 20px;
  border-radius: 20px 20px 0 0;
  text-align: center;
  font-weight: bold;
  font-size: 1.5rem;
}

.modal-left-panel {
  background: linear-gradient(135deg, #00d2ff 0%, #3a7bd5 100%);
  color: white;
  padding: 20px;
  border-radius: 15px;
}

.modal-list-item {
  background: white;
  color: #333;
  border-radius: 10px;
  padding: 10px;
  display: flex;
  align-items: center;
  gap: 15px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.modal-list-item:hover {
  background: #f0f0f0;
}

.form-input {
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: #3a7bd5;
  box-shadow: 0 0 0 3px rgba(58, 123, 213, 0.2);
}

.form-input-drop-area {
  background: #f8f8f8;
  border: 2px dashed #ccc;
  border-radius: 8px;
  padding: 10px;
  text-align: center;
  color: #999;
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.form-input-drop-area:hover {
  border-color: #3a7bd5;
  background: #f0f8ff;
}

.add-btn {
  background: #4caf50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 20px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.add-btn:hover {
  background: #45a049;
  transform: translateY(-1px);
}

.cancel-btn {
  background: #f44336;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 20px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel-btn:hover {
  background: #da190b;
  transform: translateY(-1px);
}

.modal-overlay-bg {
  background-color: rgba(0, 0, 0, 0.5);
}

.status-chip {
  display: inline-block;
  padding: 2px 10px;
  border-radius: 10px;
  color: white;
  font-size: 0.75rem;
  font-weight: bold;
  margin-top: 4px;
}

.status-chip.bg-green-500 {
  background-color: #4caf50;
}
.status-chip.bg-gray-500 {
  background-color: #9e9e9e;
}
.status-chip.bg-blue-500 {
  background-color: #2196f3;
}
.status-chip.bg-yellow-500 {
  background-color: #ffeb3b;
  color: #333;
}
</style>