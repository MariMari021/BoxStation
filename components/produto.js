import { Pressable, Text, StyleSheet, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export function Produto({ data, onDelete, onSelect, selectedId }) {
    const isSelected = data.id === selectedId;

    return (
        <Pressable
            style={[styles.container, isSelected ? styles.selectedContainer : null]}
            onPress={onSelect}
        >
            <View>
                
                <Text style={styles.text}>
                    NOME: <Text style={styles.valor}>{data.nome}</Text> 
                </Text>
                <Text style={styles.text}>
                    QUANTIDADE: <Text style={styles.valor}>{data.quantidade}</Text>
                </Text>
            </View>
            <TouchableOpacity onPress={onDelete}>
                <MaterialIcons name="delete" size={24} color="#000" />
            </TouchableOpacity>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#F5FFFA", // Mint cream color
        padding: 16,
        borderRadius: 12,
        borderColor: '#4CAF50',
        borderWidth: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginVertical: 8,
    },
    selectedContainer: {
        borderColor: '#2E7D32', // Darker green for selected state
        borderWidth: 2,
    },
    text: {
        flex: 1,
        color: '#333', // Dark text color
        fontSize: 16,
        fontWeight:'800',
        color:'#649160'
    },
    valor:{
        fontWeight:'500',
        color:'#000'
    }
});
