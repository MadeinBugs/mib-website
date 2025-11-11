# How to Add Pets to the Pets Gallery

## Step-by-Step Guide

### Step 1: Prepare Your Pet Image
1. Choose a good quality photo of your pet
2. Recommended size: at least 800x800 pixels (square format works best)
3. Save the image with a descriptive name (e.g., `fluffy.jpg`, `max.png`, `luna.jpg`)

### Step 2: Add Image to Assets Folder
1. Navigate to: `public/assets/pets/`
2. If the `pets` folder doesn't exist, create it
3. Copy your pet image into this folder
4. The file path will be: `public/assets/pets/your-pet-name.jpg`

### Step 3: Update pets.json File
1. Open the file: `src/data/pets.json`
2. Add a new entry to the `pets` array following this format:

```json
{
	"pets": [
		{
			"id": 1,
			"name": "Fluffy",
			"description": {
				"en": "Our beloved office cat who keeps us company",
				"pt-BR": "Nosso amado gato de escritório que nos faz companhia"
			},
			"image": "/assets/pets/fluffy.jpg"
		},
		{
			"id": 2,
			"name": "Max",
			"description": {
				"en": "The goodest boy and our loyal companion",
				"pt-BR": "O melhor menino e nosso companheiro leal"
			},
			"image": "/assets/pets/max.jpg"
		}
	]
}
```

### Step 4: Save and Test
1. Save the `pets.json` file
2. Refresh your website (if dev server is running, it will auto-reload)
3. Navigate to the About Us page
4. Scroll to the "To all the pets and rescues that guided us" section
5. Your pet should now appear in the gallery!

## Field Descriptions

### Required Fields:
- **id**: Unique number for each pet (increment by 1 for each new pet)
- **name**: The pet's name
- **description**: Object with English and Portuguese descriptions
  - **en**: Description in English
  - **pt-BR**: Description in Portuguese
- **image**: Path to the image (always starts with `/assets/pets/`)

## Tips

1. **Image Format**: Use JPG for photos, PNG for images with transparency
2. **Image Size**: Keep file size under 1MB for faster loading
3. **Descriptions**: Keep them short and sweet (1-2 sentences)
4. **Order**: Pets appear in the order they're listed in the JSON file
5. **ID Numbers**: Make sure each pet has a unique ID number

## Example with Multiple Pets

```json
{
	"pets": [
		{
			"id": 1,
			"name": "Sisyphus",
			"description": {
				"en": "Our studio bug mascot who inspired our name",
				"pt-BR": "Nosso mascote inseto que inspirou nosso nome"
			},
			"image": "/assets/pets/sisyphus.jpg"
		},
		{
			"id": 2,
			"name": "Luna",
			"description": {
				"en": "A rescued street cat who found her forever home with us",
				"pt-BR": "Uma gata resgatada da rua que encontrou seu lar para sempre conosco"
			},
			"image": "/assets/pets/luna.jpg"
		},
		{
			"id": 3,
			"name": "Thor",
			"description": {
				"en": "Our mighty mantis who watches over the office plants",
				"pt-BR": "Nosso poderoso louva-a-deus que cuida das plantas do escritório"
			},
			"image": "/assets/pets/thor.jpg"
		}
	]
}
```

## Gallery Features

- **Grid Layout**: Pets display in a responsive grid (2-4 columns depending on screen size)
- **Hover Effect**: Pet names appear when hovering over images
- **Click to Enlarge**: Clicking a pet opens a modal with the full image and description
- **Responsive**: Works beautifully on mobile, tablet, and desktop
- **Empty State**: Shows "Pet gallery coming soon..." message if no pets are added yet

## Troubleshooting

**Problem**: Image doesn't show up
- **Solution**: Check that the image path in JSON matches the actual file location
- Make sure the path starts with `/assets/pets/`
- Verify the file extension matches (`.jpg`, `.png`, etc.)

**Problem**: Gallery shows "coming soon" message
- **Solution**: Make sure the `pets` array in `pets.json` is not empty
- Check that the JSON syntax is correct (no missing commas or brackets)

**Problem**: Website crashes after adding pet
- **Solution**: Validate your JSON syntax using a JSON validator
- Make sure all required fields are present
- Check that IDs are unique numbers
