from PIL import Image, ImageSequence

gif = Image.open('./assets/adorable-cat.gif')

frames = []

for frame in ImageSequence.Iterator(gif):
    frame = frame.convert("RGBA")
    data = frame.getdata()
    
    new_data = []
    for item in data:
        if item[0] >= 230 and item[1] >= 230 and item[2] >= 230:
            new_data.append((255,255,255,0))
        else:
            new_data.append((0,0,0,1))
    
    frame.putdata(new_data)
    frame.info['disposal'] = 2
    frames.append(frame)

frames[0].save('./assets/modified_cat.gif', save_all=True, append_images=frames[1:], disposal=2, loop=0)