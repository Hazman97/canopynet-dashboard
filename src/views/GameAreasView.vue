<template>
    <div class="farm-areas-container">
        <!-- Header -->
        <div class="header-section">
            <div class="header-content">
                <div class="title-section">
                    <h1 class="main-title">My Farm Areas !</h1>
                    <div class="stat-item">
                        <span class="stat-icon">🗺️</span>
                        <span class="stat-text">{{ totalPhase }} Phase</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-icon">🏁</span>
                        <span class="stat-text">{{ totalBlock }} Block</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-icon">🌴</span>
                        <span class="stat-text">{{ totalTree }} Tree</span>
                    </div>
                </div>        
            </div>
            <button @click="logout" class="logout-button">
                Logout
            </button>
        </div>
    </div>

    <!-- Navigation Tabs -->
    <div class="nav-tabs">
        <button>
            class="nav-tab"
            :class"{ 'active': currentTab === 'phase' }"
            @click="currentTab === 'phase'"
        >
            <span class="tab-icon">🗺️</span>
            All Phase
        </button>
        <button>
            class="nav-tab"
            :class"{ 'active': currentTab === 'block' }"
            @click="currentTab === 'block'"
        >
            <span class="tab-icon">🏁</span>
            All Block
        </button>
        <button>
            class="nav-tab"
            :class"{ 'active': currentTab === 'tree' }"
            @click="currentTab === 'tree'"
        >
            <span class="tab-icon">🌴</span>
            All Tree
        </button>
    </div>

    <!-- All Phase Tab -->
</template>
<script>

</script>
