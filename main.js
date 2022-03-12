import './style.css';
import Alpine from 'alpinejs';
import collapse from '@alpinejs/collapse';
import persist from '@alpinejs/persist';

if (
  localStorage.theme === 'dark' ||
  (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
) {
  document.documentElement.classList.add('dark');
} else {
  document.documentElement.classList.remove('dark');
}

Alpine.plugin(collapse);
Alpine.plugin(persist);

Alpine.data('mode', () => ({
  init() {
    const systemIcon = document.getElementById('system-mode');
    const lightIcon = document.getElementById('light-mode');
    const darkIcon = document.getElementById('dark-mode');
    if (
      localStorage.theme === 'dark' ||
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      darkIcon.classList.remove('hidden');
    } else {
      if (!('theme' in localStorage)) {
        systemIcon.classList.remove('hidden');
      } else {
        lightIcon.classList.remove('hidden');
      }
      darkIcon.classList.add('hidden');
    }
  },
  toggleMode() {
    const themes = ['light', 'dark'];
    const systemIcon = document.getElementById('system-mode');
    const lightIcon = document.getElementById('light-mode');
    const darkIcon = document.getElementById('dark-mode');
    let index = themes.indexOf(localStorage.theme);
    index++;
    if (index >= themes.length) {
      systemIcon.classList.remove('hidden');
      lightIcon.classList.add('hidden');
      darkIcon.classList.add('hidden');
      localStorage.removeItem('theme');
      document.documentElement.classList.remove('dark');
    } else {
      localStorage.theme = themes[index];
      if (localStorage.theme === 'dark') {
        systemIcon.classList.add('hidden');
        lightIcon.classList.add('hidden');
        darkIcon.classList.remove('hidden');
        document.documentElement.classList.add('dark');
      } else {
        systemIcon.classList.add('hidden');
        lightIcon.classList.remove('hidden');
        darkIcon.classList.add('hidden');
        document.documentElement.classList.remove('dark');
      }
    }
  }
}));

Alpine.data('sidebar', (initialOpenState = true) => ({
  openSidebar: initialOpenState,
  init() {
    let mq = window.matchMedia('(min-width: 640px)');
    if (mq.matches) {
      this.openSidebar = true;
    } else {
      this.openSidebar = false;
    }
  },
  resizeOverlay() {
    this.$el.style.display = this.openSidebar && 'none';
  },
  resizeWrapper() {
    this.openSidebar = window.innerWidth > 640 ? true : false;
    this.$el.style.display = this.openSidebar ? 'flex' : 'none';
  },
  toggleSidebar() {
    this.openSidebar = !this.openSidebar;
  }
}));

Alpine.data('menuAccount', (initialOpenMenuAccountState = false) => ({
  activeDescendant: null,
  activeIndex: null,
  items: null,
  openMenuAccount: initialOpenMenuAccountState,
  init() {
    this.items = Array.from(this.$el.querySelectorAll('[role="menuitem"]'));
    this.$watch('openMenuAccount', () => {
      if (this.openMenuAccount) this.activeIndex = -1;
    });
  },
  focusButton() {
    this.$refs.button.focus();
  },
  toggle() {
    this.openMenuAccount = !this.openMenuAccount;
    if (this.openMenuAccount)
      this.$nextTick(() => {
        this.$refs['menu-items'].focus();
      });
  },
  onButtonEnter() {
    this.openMenuAccount = !this.openMenuAccount;
    if (this.openMenuAccount) {
      this.activeIndex = 0;
      this.activeDescendant = this.items[this.activeIndex].id;
      this.$nextTick(() => this.$refs['menu-items'].focus());
    }
  },
  onArrowUp() {
    if (!this.openMenuAccount) return (this.openMenuAccount = true);
    if (this.activeIndex !== 0) {
      this.activeIndex = this.activeIndex === -1 ? this.items.length - 1 : this.activeIndex - 1;
    } else {
      this.activeIndex = this.items.length - 1;
    }
    this.activeDescendant = this.items[this.activeIndex].id;
  },
  onArrowDown() {
    if (!this.openMenuAccount) return (this.openMenuAccount = true);
    if (this.activeIndex !== this.items.length - 1) {
      this.activeIndex = this.activeIndex + 1;
    } else {
      this.activeIndex = 0;
    }
    this.activeDescendant = this.items[this.activeIndex].id;
  },
  onClickOutside(e) {
    if (this.openMenuAccount) {
      const t = [
        '[contentEditable=true]',
        '[tabindex]',
        'a[href]',
        'area[href]',
        'button:not([disabled])',
        'iframe',
        'input:not([disabled])',
        'select:not([disabled])',
        'textarea:not([disabled])'
      ]
        .map((e) => `${e}:not([tabindex='-1'])`)
        .join(',');
      this.openMenuAccount = false;
      if (e.target.closest(t)) return;
      this.focusButton();
    }
  }
}));

Alpine.data(
  'listboxPlatforms',
  ({ initialOpenState = false, items = e.items, modelName = e.modelName }, ...e) => ({
    openListboxPlatforms: initialOpenState,
    activeIndex: Alpine.$persist(null),
    selectedIndex: Alpine.$persist(0),
    activeDescendant: null,
    optionCount: null,
    items: items,
    modelName: modelName,
    init() {
      this.optionCount = this.$refs.listbox.children.length;
      this.$watch('activeIndex', () => {
        if (this.openListboxPlatforms) {
          if (this.activeIndex !== null) {
            this.activeDescendant = this.$refs.listbox.children[this.activeIndex].id;
          } else {
            this.activeDescendant = '';
          }
        }
      });
    },
    toggle() {
      if (this.openListboxPlatforms) return;
      this.activeIndex = this.selectedIndex;
      this.openListboxPlatforms = true;
      this.$nextTick(() => {
        this.$refs.listbox.focus();
        this.$refs.listbox.children[this.activeIndex].scrollIntoView({
          block: 'nearest'
        });
      });
    },
    choose(e) {
      this.selectedIndex = e;
      this.openListboxPlatforms = false;
    },
    close(focusAfter) {
      this.openListboxPlatforms = false;
      focusAfter && focusAfter.focus();
    },
    onOptionSelect() {
      if (this.activeIndex !== null) {
        this.selectedIndex = this.activeIndex;
      }
      this.openListboxPlatforms = false;
      this.$refs.button.focus();
    },
    onEscape() {
      this.openListboxPlatforms = false;
      this.$refs.button.focus();
    },
    onArrowUp() {
      this.activeIndex = this.activeIndex - 1 < 0 ? this.optionCount - 1 : this.activeIndex - 1;
      this.$refs.listbox.children[this.activeIndex].scrollIntoView({
        block: 'nearest'
      });
    },
    onArrowDown() {
      this.activeIndex = this.activeIndex + 1 > this.optionCount - 1 ? 0 : this.activeIndex + 1;
      this.$refs.listbox.children[this.activeIndex].scrollIntoView({
        block: 'nearest'
      });
    },
    get active() {
      return this.items[this.activeIndex];
    },
    get [e.modelName || 'selected']() {
      return this.items[this.selectedIndex];
    }
  })
);

Alpine.data(
  'listboxPrice',
  ({ initialOpenState = false, items = e.items, modelName = e.modelName }, ...e) => ({
    openListboxPrice: initialOpenState,
    activeIndex: Alpine.$persist(null),
    selectedIndex: Alpine.$persist(0),
    activeDescendant: null,
    optionCount: null,
    items: items,
    modelName: modelName,
    init() {
      this.optionCount = this.$refs.listbox.children.length;
      this.$watch('activeIndex', () => {
        if (this.openListboxPrice) {
          if (this.activeIndex !== null) {
            this.activeDescendant = this.$refs.listbox.children[this.activeIndex].id;
          } else {
            this.activeDescendant = '';
          }
        }
      });
    },
    toggle() {
      if (this.openListboxPrice) return;
      this.activeIndex = this.selectedIndex;
      this.openListboxPrice = true;
      this.$nextTick(() => {
        this.$refs.listbox.focus();
        this.$refs.listbox.children[this.activeIndex].scrollIntoView({
          block: 'nearest'
        });
      });
    },
    choose(e) {
      this.selectedIndex = e;
      this.openListboxPrice = false;
    },
    close(focusAfter) {
      this.openListboxPrice = false;
      focusAfter && focusAfter.focus();
    },
    onOptionSelect() {
      if (this.activeIndex !== null) {
        this.selectedIndex = this.activeIndex;
      }
      this.openListboxPrice = false;
      this.$refs.button.focus();
    },
    onEscape() {
      this.openListboxPrice = false;
      this.$refs.button.focus();
    },
    onArrowUp() {
      this.activeIndex = this.activeIndex - 1 < 0 ? this.optionCount - 1 : this.activeIndex - 1;
      this.$refs.listbox.children[this.activeIndex].scrollIntoView({
        block: 'nearest'
      });
    },
    onArrowDown() {
      this.activeIndex = this.activeIndex + 1 > this.optionCount - 1 ? 0 : this.activeIndex + 1;
      this.$refs.listbox.children[this.activeIndex].scrollIntoView({
        block: 'nearest'
      });
    },
    get active() {
      return this.items[this.activeIndex];
    },
    get [e.modelName || 'selected']() {
      return this.items[this.selectedIndex];
    }
  })
);

Alpine.data(
  'listboxCategory',
  ({ initialOpenState = false, items = e.items, modelName = e.modelName }, ...e) => ({
    openListboxCategory: initialOpenState,
    activeIndex: Alpine.$persist(null),
    selectedIndex: Alpine.$persist(0),
    activeDescendant: null,
    optionCount: null,
    items: items,
    modelName: modelName,
    init() {
      this.optionCount = this.$refs.listbox.children.length;
      this.$watch('activeIndex', () => {
        if (this.openListboxCategory) {
          if (this.activeIndex !== null) {
            this.activeDescendant = this.$refs.listbox.children[this.activeIndex].id;
          } else {
            this.activeDescendant = '';
          }
        }
      });
    },
    toggle() {
      if (this.openListboxCategory) return;
      this.activeIndex = this.selectedIndex;
      this.openListboxCategory = true;
      this.$nextTick(() => {
        this.$refs.listbox.focus();
        this.$refs.listbox.children[this.activeIndex].scrollIntoView({
          block: 'nearest'
        });
      });
    },
    choose(e) {
      this.selectedIndex = e;
      this.openListboxCategory = false;
    },
    close(focusAfter) {
      this.openListboxCategory = false;
      focusAfter && focusAfter.focus();
    },
    onOptionSelect() {
      if (this.activeIndex !== null) {
        this.selectedIndex = this.activeIndex;
      }
      this.openListboxCategory = false;
      this.$refs.button.focus();
    },
    onEscape() {
      this.openListboxCategory = false;
      this.$refs.button.focus();
    },
    onArrowUp() {
      this.activeIndex = this.activeIndex - 1 < 0 ? this.optionCount - 1 : this.activeIndex - 1;
      this.$refs.listbox.children[this.activeIndex].scrollIntoView({
        block: 'nearest'
      });
    },
    onArrowDown() {
      this.activeIndex = this.activeIndex + 1 > this.optionCount - 1 ? 0 : this.activeIndex + 1;
      this.$refs.listbox.children[this.activeIndex].scrollIntoView({
        block: 'nearest'
      });
    },
    get active() {
      return this.items[this.activeIndex];
    },
    get [e.modelName || 'selected']() {
      return this.items[this.selectedIndex];
    }
  })
);

Alpine.data('switchView', (initialViewState = 'grid') => ({
  view: Alpine.$persist(initialViewState),
  toggleView() {
    this.view = this.view === 'grid' ? 'list' : 'grid';
  }
}));

Alpine.data('switchSubscriptions', (initialSubscriptionState = 'monthly') => ({
  subscription: initialSubscriptionState,
  toggleSubscription() {
    this.subscription = this.subscription === 'monthly' ? 'annual' : 'monthly';
  }
}));

Alpine.data('modalWorkspace', (initialOpenState = false) => ({
  openModalWorkspace: initialOpenState,
  toggleModalWorkspace() {
    this.openModalWorkspace = true;
    this.$nextTick(() => {
      this.$refs.workspaceName.focus();
    });
  },
  closeModalWorkspace() {
    this.openModalWorkspace = false;
  }
}));

Alpine.data('modalToken', (initialOpenState = false) => ({
  openModalToken: initialOpenState,
  toggleModalToken() {
    this.openModalToken = true;
    this.$nextTick(() => {
      this.$refs.tokenName.focus();
    });
  },
  closeModalToken() {
    this.openModalToken = false;
  }
}));

window.Alpine = Alpine;

Alpine.start();
