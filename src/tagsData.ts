export const tagsData = {
  sage: {
    categories: {
      "What do you like having around?": [
        { label: "Mountains", conflict: [] },
        { label: "Coastline", conflict: [] },
        { label: "Forest", conflict: [] },
        { label: "Meadow", conflict: [] },
        { label: "Rivers", conflict: [] },
        { label: "Lakes", conflict: [] },
      ],
      "How do you like the weather?": [
        { label: "Warm and sunny", conflict: ["Season Change"] },
        { label: "Mild", conflict: [] },
        { label: "Season Change", conflict: ["Warm and sunny"] },
      ],
      "Pick the gardens that match your vision": [
        { label: "Vegetables", conflict: [] },
        { label: "Food forest and fruit orchards", conflict: [] },
        { label: "Herbs and aromatics", conflict: [] },
      ],
      "What are some of the other food sources that feel important?": [
        { label: "Mushrooms and berries foraging", conflict: [] },
        { label: "Beekeeping", conflict: [] },
        { label: "Poultry and livestock", conflict: [] },
        { label: "Dairy", conflict: [] },
      ],
    },
  },
};