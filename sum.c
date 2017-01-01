#include "stdio.h"
#include "stdlib.h"

int sumOf4And5(){
	int a = 4;
	int b = 5;

	printf("%d\n", a);
	printf("%d\n", b);

	return a + b;
}

int sum(int a, int b){
	int c = a + b;
	int *d = malloc(sizeof(int));
	*d = 23;
	free(d);
	return a + b;
}

int main(){
	printf("Sum of 4 and 7 is %d\n", sum(4,7));
	printf("Sum of 4 and 5 is %d\n", sumOf4And5());
	return 0;
}