

def process_word(word):
    if word[0].isdigit():
        return None
    else:
        new_word = word.capitalize() + '0'
        return new_word

with open('rockyou.txt', 'r', encoding='utf-8') as input_file:
    with open('rockyou_mod.txt', 'w', encoding='utf-8') as output_file:
        word_count = 0
        for line in input_file:
            word = line.strip()
            if word:
                new_word = process_word(word)
                if new_word:
                    output_file.write(new_word + '\n')
                    word_count += 1

print(f'\nEl nuevo archivo tiene {word_count} palabras.\n')


